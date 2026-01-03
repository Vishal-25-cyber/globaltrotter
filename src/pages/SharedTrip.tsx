import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { 
  MapPin, 
  Calendar,
  Wallet,
  Loader2,
  Clock,
  Hotel,
  Car,
  Utensils,
  ShoppingBag,
  Sparkles,
  MoreHorizontal,
  Globe
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  total_budget_inr: number;
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

export default function SharedTrip() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (shareCode) {
      fetchSharedTrip();
    }
  }, [shareCode]);

  const fetchSharedTrip = async () => {
    try {
      // Fetch trip by share code
      const { data: tripData, error: tripError } = await api.getSharedTrip(shareCode!);

      if (tripError || !tripData) {
        setNotFound(true);
        return;
      }
      
      setTrip(tripData as unknown as Trip);

      // Fetch itinerary
      const { data: itineraryData } = await api.getItineraryItems(tripData.id);

      setItinerary(itineraryData as unknown as ItineraryItem[] || []);

      // Fetch budget
      const { data: budgetData } = await api.getBudgetItems(tripData.id);

      setBudget(budgetData || []);

    } catch (err) {
      console.error('Error fetching shared trip:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Globe className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Trip not found</h1>
          <p className="text-muted-foreground mb-6">
            This trip may have been removed or the link is incorrect.
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm mb-4">
              <Globe className="w-4 h-4" />
              Shared Trip
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              {trip.city.name}, {trip.city.country}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {trip.title}
            </h1>
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
                    {items.map((item) => (
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

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Want to plan your own trip?
                </p>
                <Button asChild variant="hero" className="w-full">
                  <Link to="/auth?mode=signup">
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
