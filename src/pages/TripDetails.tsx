import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  MapPin,
  Calendar,
  Wallet,
  Share2,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Clock,
  Hotel,
  Car,
  Utensils,
  ShoppingBag,
  Sparkles,
  MoreHorizontal
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: string;
  total_budget_inr: number;
  is_public: boolean;
  share_code: string | null;
  notes: string | null;
  city: {
    name: string;
    country: string;
    image_url: string | null;
  };
}

interface ItineraryItem {
  id: string;
  day_number: number;
  activity_name: string;
  activity_description: string | null;
  estimated_cost_inr: number;
  start_time: string | null;
  order_index: number;
  tourist_place: {
    category: string;
    avg_time_hours: number;
    best_time_to_visit: string | null;
    image_url: string | null;
  } | null;
}

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount_inr: number;
  is_estimated: boolean;
}

const categoryIcons: Record<string, typeof Hotel> = {
  accommodation: Hotel,
  transport: Car,
  food: Utensils,
  activities: Sparkles,
  shopping: ShoppingBag,
  miscellaneous: MoreHorizontal
};

const categoryColors: Record<string, string> = {
  accommodation: 'budget-pill-accommodation',
  transport: 'budget-pill-transport',
  food: 'budget-pill-food',
  activities: 'budget-pill-activities',
  shopping: 'budget-pill-shopping',
  miscellaneous: 'budget-pill-miscellaneous'
};

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) {
      fetchTripDetails();
    }
  }, [id, user]);

  const fetchTripDetails = async () => {
    try {
      // Fetch trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select(`
          *,
          city:cities(name, country, image_url)
        `)
        .eq('id', id)
        .single();

      if (tripError) throw tripError;
      setTrip(tripData as unknown as Trip);

      // Fetch itinerary
      const { data: itineraryData, error: itineraryError } = await supabase
        .from('itinerary_items')
        .select(`
          *,
          tourist_place:tourist_places(category, avg_time_hours, best_time_to_visit, image_url)
        `)
        .eq('trip_id', id)
        .order('day_number')
        .order('order_index');

      if (itineraryError) throw itineraryError;
      setItinerary(itineraryData as unknown as ItineraryItem[]);

      // Fetch budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget_items')
        .select('*')
        .eq('trip_id', id)
        .order('amount_inr', { ascending: false });

      if (budgetError) throw budgetError;
      setBudget(budgetData);

    } catch (err) {
      console.error('Error fetching trip:', err);
      toast({
        title: 'Error loading trip',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShare = async () => {
    if (!trip) return;
    setSharing(true);

    try {
      const { error } = await supabase
        .from('trips')
        .update({ is_public: !trip.is_public })
        .eq('id', trip.id);

      if (error) throw error;

      setTrip({ ...trip, is_public: !trip.is_public });
      toast({
        title: trip.is_public ? 'Trip is now private' : 'Trip is now shareable! 🔗',
        description: trip.is_public ? '' : 'Anyone with the link can view it.',
      });
    } catch (err) {
      console.error('Error updating share status:', err);
    } finally {
      setSharing(false);
    }
  };

  const copyShareLink = async () => {
    if (!trip?.share_code) return;

    const shareUrl = `${window.location.origin}/shared/${trip.share_code}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: 'Link copied! 📋',
      description: 'Share it with your travel companions.',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
        <p className="text-white/80 mb-4">Trip not found</p>
        <Button asChild variant="outline" className="text-black bg-white">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const days = differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1;
  const groupedItinerary = itinerary.reduce((acc, item) => {
    if (!acc[item.day_number]) acc[item.day_number] = [];
    acc[item.day_number].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const totalBudget = budget.reduce((sum, item) => sum + item.amount_inr, 0);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl mb-8 border border-white/10 group">
          {trip.city.image_url ? (
            <img
              src={trip.city.image_url}
              alt={trip.city.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-hero" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to trips
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <MapPin className="w-4 h-4" />
                  {trip.city.name}, {trip.city.country}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                  {trip.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {trip.is_public && trip.share_code && (
                  <Button variant="outline" size="sm" onClick={copyShareLink} className="bg-black/20 text-white border-white/20 hover:bg-white/20">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                )}
                <Button
                  variant={trip.is_public ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={toggleShare}
                  disabled={sharing}
                  className={trip.is_public ? "bg-white text-black hover:bg-white/90" : "bg-black/20 text-white border-white/20 hover:bg-white/20"}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {trip.is_public ? 'Public' : 'Make Shareable'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/70">Duration</p>
                <p className="font-semibold text-white">{days} Days</p>
                <p className="text-xs text-white/50">
                  {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/70">Places</p>
                <p className="font-semibold text-white">{itinerary.length} Activities</p>
                <p className="text-xs text-white/50">Across {Object.keys(groupedItinerary).length} days</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/70">Total Budget</p>
                <p className="font-semibold text-white">₹{totalBudget.toLocaleString('en-IN')}</p>
                <p className="text-xs text-white/50">~₹{Math.round(totalBudget / days).toLocaleString('en-IN')}/day</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Itinerary */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Day-wise Itinerary
            </h2>

            <div className="space-y-6">
              {Object.entries(groupedItinerary).map(([day, items]) => (
                <div key={day} className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-md">
                      {day}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Day {day}
                    </h3>
                  </div>

                  <div className="space-y-6 ml-5 border-l-2 border-white/10 pl-6">
                    {items.map((item, i) => (
                      <div key={item.id} className="relative group/item">
                        <div className="absolute -left-[1.875rem] top-1 w-3 h-3 rounded-full bg-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-white text-lg">{item.activity_name}</h4>
                            {item.activity_description && (
                              <p className="text-sm text-white/70 mt-1">
                                {item.activity_description}
                              </p>
                            )}

                            {/* Tourist Place Image */}
                            {item.tourist_place?.image_url && (
                              <div className="mt-3 rounded-xl overflow-hidden h-40 w-full md:w-64 shadow-md border border-white/10">
                                <img
                                  src={item.tourist_place.image_url}
                                  alt={item.activity_name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
                              {item.tourist_place?.avg_time_hours && (
                                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                  <Clock className="w-3 h-3" />
                                  ~{item.tourist_place.avg_time_hours}h
                                </span>
                              )}
                              {item.tourist_place?.best_time_to_visit && (
                                <span className="capitalize bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                  {item.tourist_place.best_time_to_visit}
                                </span>
                              )}
                            </div>
                          </div>
                          {item.estimated_cost_inr > 0 && (
                            <span className="text-sm font-bold text-white bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 shrink-0 ml-4">
                              ₹{item.estimated_cost_inr}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Breakdown */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-green-400" />
              Budget Breakdown
            </h2>

            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg sticky top-24">
              <div className="text-center mb-6 p-6 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
                <p className="text-sm text-white/70 mb-1">Total Estimated Cost</p>
                <p className="text-4xl font-bold text-white drop-shadow-lg">
                  ₹{totalBudget.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="space-y-4">
                {budget.map((item) => {
                  const Icon = categoryIcons[item.category] || MoreHorizontal;
                  // Simplified colors for dark mode
                  const percentage = Math.round((item.amount_inr / totalBudget) * 100);

                  return (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="capitalize text-white/90 font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          ₹{item.amount_inr.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-white/50">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-sm text-white/50 text-center">
                  💡 These are estimated costs. Actual expenses may vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

