import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus,
  MapPin,
  Calendar,
  Wallet,
  ArrowRight,
  Loader2,
  Plane,
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: string;
  total_budget_inr: number;
  city: {
    name: string;
    country: string;
    image_url: string | null;
  };
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const handleDeleteTrip = async (tripId: string, tripTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${tripTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      setTrips(trips.filter(trip => trip.id !== tripId));
      toast({
        title: 'Trip deleted',
        description: 'Your trip has been successfully deleted.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete trip',
        variant: 'destructive',
      });
    }
  };

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          id,
          title,
          start_date,
          end_date,
          status,
          total_budget_inr,
          city:cities(name, country, image_url)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data as unknown as Trip[]);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-info/10 text-info';
      case 'confirmed': return 'bg-success/10 text-success';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-black/20 backdrop-blur-md rounded-3xl p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10 shadow-xl animate-fade-in-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Trips</h1>
            <p className="text-white/90 text-lg">
              Manage your travel plans and itineraries.
            </p>
          </div>
          <Button asChild variant="hero" size="lg" className="shadow-lg hover:scale-105 transition-transform">
            <Link to="/create-trip">
              <Plus className="w-5 h-5 mr-2" />
              Plan New Trip
            </Link>
          </Button>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No trips yet
            </h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Start planning your first adventure! Pick a destination and we'll help you create the perfect itinerary.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/create-trip">
                <Plus className="w-5 h-5" />
                Plan Your First Trip
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="travel-card group bg-black/20 backdrop-blur-md border border-white/10 relative"
              >
                {/* Image */}
                <Link to={`/trip/${trip.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    {trip.city.image_url ? (
                      <img
                        src={trip.city.image_url}
                        alt={trip.city.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-hero" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>

                    {/* Three-dot menu */}
                    <div className="absolute top-4 left-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/create-trip?tripId=${trip.id}`); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteTrip(trip.id, trip.title, e)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* City name */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{trip.city.name}, {trip.city.country}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <Link to={`/trip/${trip.id}`} className="block p-5">
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span>₹{trip.total_budget_inr.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
