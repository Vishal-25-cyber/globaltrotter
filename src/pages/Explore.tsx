import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  MapPin, 
  Wallet,
  Sun,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface City {
  id: string;
  name: string;
  country: string;
  description: string | null;
  image_url: string | null;
  avg_daily_budget_inr: number;
  best_season: string | null;
}

export default function Explore() {
  const { user } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');

      if (error) throw error;
      setCities(data || []);
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Explore Destinations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover incredible cities across India. Pick your destination and we'll help you plan the perfect trip.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-2xl border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Cities Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No destinations found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="travel-card group overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {city.image_url ? (
                      <img
                        src={city.image_url}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-hero" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* City name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                        <MapPin className="w-4 h-4" />
                        {city.country}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {city.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {city.description || 'Explore this beautiful destination'}
                    </p>

                    <div className="flex items-center gap-4 text-sm mb-5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Wallet className="w-4 h-4 text-primary" />
                        <span>~₹{city.avg_daily_budget_inr.toLocaleString('en-IN')}/day</span>
                      </div>
                      {city.best_season && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Sun className="w-4 h-4 text-accent" />
                          <span>{city.best_season}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      asChild 
                      variant={user ? 'hero' : 'outline'} 
                      className="w-full"
                    >
                      <Link to={user ? `/create-trip?city=${city.id}` : '/auth?mode=signup'}>
                        {user ? 'Plan Trip Here' : 'Sign up to Plan'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
