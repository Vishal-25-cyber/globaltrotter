import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  MapPin,
  CalendarIcon,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface City {
  id: string;
  name: string;
  country: string;
  image_url: string | null;
  avg_daily_budget_inr: number;
}

interface TouristPlace {
  id: string;
  name: string;
  description: string | null;
  category: string;
  avg_time_hours: number;
  entry_fee_inr: number;
  best_time_to_visit: string | null;
}

type Step = 'destination' | 'dates' | 'places' | 'review';

export default function CreateTrip() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('destination');
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [tripTitle, setTripTitle] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const cityId = searchParams.get('city');
    if (cityId && cities.length > 0) {
      const city = cities.find(c => c.id === cityId);
      if (city) {
        setSelectedCity(city);
        setStep('dates');
      }
    }
  }, [searchParams, cities]);

  useEffect(() => {
    if (selectedCity) {
      fetchPlaces(selectedCity.id);
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, country, image_url, avg_daily_budget_inr')
        .order('name');

      if (error) throw error;
      setCities(data || []);
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async (cityId: string) => {
    try {
      const { data, error } = await supabase
        .from('tourist_places')
        .select('*')
        .eq('city_id', cityId)
        .order('category');

      if (error) throw error;
      setPlaces(data || []);
    } catch (err) {
      console.error('Error fetching places:', err);
    }
  };

  const togglePlace = (placeId: string) => {
    setSelectedPlaces(prev =>
      prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const calculateBudget = () => {
    if (!startDate || !endDate || !selectedCity) return 0;

    const days = differenceInDays(endDate, startDate) + 1;
    const dailyBudget = selectedCity.avg_daily_budget_inr;
    const placeFees = places
      .filter(p => selectedPlaces.includes(p.id))
      .reduce((sum, p) => sum + p.entry_fee_inr, 0);

    return (days * dailyBudget) + placeFees;
  };

  const createTrip = async () => {
    if (!user || !selectedCity || !startDate || !endDate) return;

    setCreating(true);

    try {
      const title = tripTitle || `Trip to ${selectedCity.name}`;
      const totalBudget = calculateBudget();
      const days = differenceInDays(endDate, startDate) + 1;

      // Create trip
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          city_id: selectedCity.id,
          title,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          total_budget_inr: totalBudget,
          status: 'planning'
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // Create itinerary items
      const selectedPlaceData = places.filter(p => selectedPlaces.includes(p.id));
      const itemsPerDay = Math.ceil(selectedPlaceData.length / days);

      const itineraryItems = selectedPlaceData.map((place, index) => ({
        trip_id: trip.id,
        tourist_place_id: place.id,
        day_number: Math.floor(index / itemsPerDay) + 1,
        activity_name: place.name,
        activity_description: place.description,
        estimated_cost_inr: place.entry_fee_inr,
        order_index: index % itemsPerDay
      }));

      if (itineraryItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('itinerary_items')
          .insert(itineraryItems);

        if (itemsError) throw itemsError;
      }

      // Create budget items
      const budgetItems = [
        {
          trip_id: trip.id,
          category: 'accommodation' as const,
          description: 'Hotel/Stay',
          amount_inr: Math.round(days * selectedCity.avg_daily_budget_inr * 0.4),
          is_estimated: true
        },
        {
          trip_id: trip.id,
          category: 'transport' as const,
          description: 'Local transport & travel',
          amount_inr: Math.round(days * selectedCity.avg_daily_budget_inr * 0.2),
          is_estimated: true
        },
        {
          trip_id: trip.id,
          category: 'food' as const,
          description: 'Meals & dining',
          amount_inr: Math.round(days * selectedCity.avg_daily_budget_inr * 0.25),
          is_estimated: true
        },
        {
          trip_id: trip.id,
          category: 'activities' as const,
          description: 'Entry fees & activities',
          amount_inr: places.filter(p => selectedPlaces.includes(p.id)).reduce((sum, p) => sum + p.entry_fee_inr, 0),
          is_estimated: true
        },
        {
          trip_id: trip.id,
          category: 'miscellaneous' as const,
          description: 'Shopping & miscellaneous',
          amount_inr: Math.round(days * selectedCity.avg_daily_budget_inr * 0.15),
          is_estimated: true
        }
      ];

      const { error: budgetError } = await supabase
        .from('budget_items')
        .insert(budgetItems);

      if (budgetError) throw budgetError;

      toast({
        title: 'Trip created! 🎉',
        description: 'Your itinerary and budget are ready.',
      });

      navigate(`/trip/${trip.id}`);
    } catch (err) {
      console.error('Error creating trip:', err);
      toast({
        title: 'Failed to create trip',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'destination': return selectedCity !== null;
      case 'dates': return startDate && endDate && startDate <= endDate;
      case 'places': return selectedPlaces.length > 0;
      case 'review': return true;
      default: return false;
    }
  };

  const goNext = () => {
    const steps: Step[] = ['destination', 'dates', 'places', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const steps: Step[] = ['destination', 'dates', 'places', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {['destination', 'dates', 'places', 'review'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all border border-white/10",
                    step === s
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                      : ['destination', 'dates', 'places', 'review'].indexOf(step) > i
                        ? "bg-primary/20 text-primary"
                        : "bg-white/5 text-white/40"
                  )}
                >
                  {['destination', 'dates', 'places', 'review'].indexOf(step) > i ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && (
                  <div className={cn(
                    "w-12 h-1 mx-1 rounded-full",
                    ['destination', 'dates', 'places', 'review'].indexOf(step) > i
                      ? "bg-primary/40"
                      : "bg-white/10"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="animate-fade-in text-white">
            {step === 'destination' && (
              <div>
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                  Where do you want to go?
                </h1>
                <p className="text-white/70 text-center mb-8">
                  Choose your dream destination
                </p>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cities.map(city => (
                      <button
                        key={city.id}
                        onClick={() => setSelectedCity(city)}
                        className={cn(
                          "relative rounded-2xl overflow-hidden h-40 transition-all border border-white/10",
                          selectedCity?.id === city.id
                            ? "ring-4 ring-primary ring-offset-2 ring-offset-black/20 scale-[1.02]"
                            : "hover:scale-[1.02] hover:border-white/30"
                        )}
                      >
                        {city.image_url ? (
                          <img
                            src={city.image_url}
                            alt={city.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-hero" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-left">
                          <div className="flex items-center gap-1 text-white/80 text-sm">
                            <MapPin className="w-3 h-3" />
                            {city.country}
                          </div>
                          <h3 className="text-xl font-bold text-white">{city.name}</h3>
                        </div>
                        {selectedCity?.id === city.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 'dates' && (
              <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                  When are you traveling?
                </h1>
                <p className="text-white/70 text-center mb-8">
                  Select your travel dates
                </p>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="tripTitle" className="text-white">Trip Name (optional)</Label>
                    <Input
                      id="tripTitle"
                      placeholder={`Trip to ${selectedCity?.name}`}
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                      className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                              !startDate && "text-white/40"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/10 text-white">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              if (date && (!endDate || endDate < date)) {
                                setEndDate(addDays(date, 2));
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="bg-zinc-900 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-white">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                              !endDate && "text-white/40"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/10 text-white">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => date < (startDate || new Date())}
                            initialFocus
                            className="bg-zinc-900 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-primary font-semibold">
                        {days} {days === 1 ? 'day' : 'days'} trip
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 'places' && (
              <div>
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                  What do you want to see?
                </h1>
                <p className="text-white/70 text-center mb-8">
                  Select the places you'd like to visit in {selectedCity?.name}
                </p>

                {places.length === 0 ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-white/50">Loading places...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {places.map(place => (
                      <button
                        key={place.id}
                        onClick={() => togglePlace(place.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          selectedPlaces.includes(place.id)
                            ? "border-primary bg-primary/10"
                            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{place.name}</h3>
                            <p className="text-sm text-white/60 mt-1 line-clamp-2">
                              {place.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
                              <span className="capitalize">{place.category}</span>
                              <span>~{place.avg_time_hours}h</span>
                              {place.entry_fee_inr > 0 && (
                                <span>₹{place.entry_fee_inr}</span>
                              )}
                            </div>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3",
                            selectedPlaces.includes(place.id)
                              ? "bg-primary text-primary-foreground"
                              : "border-2 border-white/20"
                          )}>
                            {selectedPlaces.includes(place.id) && (
                              <Check className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-center text-sm text-white/50 mt-6">
                  {selectedPlaces.length} places selected
                </p>
              </div>
            )}

            {step === 'review' && (
              <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                  Review Your Trip
                </h1>
                <p className="text-white/70 text-center mb-8">
                  Confirm your trip details
                </p>

                <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 p-6 space-y-6">
                  {/* Destination */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      {selectedCity?.image_url ? (
                        <img
                          src={selectedCity.image_url}
                          alt={selectedCity.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-hero" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white/50">Destination</p>
                      <h3 className="text-xl font-bold text-white">
                        {selectedCity?.name}, {selectedCity?.country}
                      </h3>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Dates */}
                  <div>
                    <p className="text-sm text-white/50 mb-1">Travel Dates</p>
                    <p className="font-semibold text-white">
                      {startDate && format(startDate, 'PPP')} - {endDate && format(endDate, 'PPP')}
                    </p>
                    <p className="text-primary text-sm mt-1">{days} days</p>
                  </div>

                  <hr className="border-white/10" />

                  {/* Places */}
                  <div>
                    <p className="text-sm text-white/50 mb-2">Places to Visit</p>
                    <div className="flex flex-wrap gap-2">
                      {places
                        .filter(p => selectedPlaces.includes(p.id))
                        .map(place => (
                          <span
                            key={place.id}
                            className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm border border-primary/20"
                          >
                            {place.name}
                          </span>
                        ))}
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Budget */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <p className="text-sm text-white/70">Estimated Budget</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      ₹{calculateBudget().toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      Includes accommodation, transport, food & activities
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 'destination'}
              className="text-white hover:text-white hover:bg-white/10 disabled:text-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step === 'review' ? (
              <Button variant="hero" onClick={createTrip} disabled={creating} className="shadow-lg hover:shadow-primary/25">
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Trip...
                  </>
                ) : (
                  <>
                    Create Trip
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button variant="hero" onClick={goNext} disabled={!canProceed()} className="shadow-lg hover:shadow-primary/25">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>

  );
}
