import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
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
          tourist_place:tourist_places(category, avg_time_hours, best_time_to_visit)
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground mb-4">Trip not found</p>
        <Button asChild>
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {trip.city.image_url ? (
          <img
            src={trip.city.image_url}
            alt={trip.city.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-hero" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to trips
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {trip.city.name}, {trip.city.country}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {trip.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                {trip.is_public && trip.share_code && (
                  <Button variant="glass" size="sm" onClick={copyShareLink}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                )}
                <Button
                  variant={trip.is_public ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={toggleShare}
                  disabled={sharing}
                >
                  <Share2 className="w-4 h-4" />
                  {trip.is_public ? 'Public' : 'Make Shareable'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Trip Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="travel-card p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold text-foreground">{days} Days</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <div className="travel-card p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Places</p>
                <p className="font-semibold text-foreground">{itinerary.length} Activities</p>
                <p className="text-xs text-muted-foreground">Across {Object.keys(groupedItinerary).length} days</p>
              </div>
            </div>
          </div>

          <div className="travel-card p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="font-semibold text-foreground">₹{totalBudget.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground">~₹{Math.round(totalBudget / days).toLocaleString('en-IN')}/day</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Itinerary */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Day-wise Itinerary</h2>
            
            <div className="space-y-6">
              {Object.entries(groupedItinerary).map(([day, items]) => (
                <div key={day} className="travel-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {day}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Day {day}
                    </h3>
                  </div>

                  <div className="space-y-4 ml-5 border-l-2 border-border pl-6">
                    {items.map((item, i) => (
                      <div key={item.id} className="relative">
                        <div className="absolute -left-[1.875rem] top-1 w-3 h-3 rounded-full bg-primary/20 border-2 border-primary" />
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{item.activity_name}</h4>
                            {item.activity_description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.activity_description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {item.tourist_place?.avg_time_hours && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  ~{item.tourist_place.avg_time_hours}h
                                </span>
                              )}
                              {item.tourist_place?.best_time_to_visit && (
                                <span className="capitalize">{item.tourist_place.best_time_to_visit}</span>
                              )}
                            </div>
                          </div>
                          {item.estimated_cost_inr > 0 && (
                            <span className="text-sm font-medium text-foreground shrink-0 ml-4">
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
            <h2 className="text-2xl font-bold text-foreground mb-6">Budget Breakdown</h2>
            
            <div className="travel-card p-6 sticky top-24">
              <div className="text-center mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
                <p className="text-sm text-muted-foreground mb-1">Total Estimated</p>
                <p className="text-4xl font-bold text-foreground">
                  ₹{totalBudget.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="space-y-3">
                {budget.map((item) => {
                  const Icon = categoryIcons[item.category] || MoreHorizontal;
                  const colorClass = categoryColors[item.category] || 'budget-pill-miscellaneous';
                  const percentage = Math.round((item.amount_inr / totalBudget) * 100);
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className={`budget-pill ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{item.category}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{item.amount_inr.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted-foreground">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  💡 These are estimated costs. Actual expenses may vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
