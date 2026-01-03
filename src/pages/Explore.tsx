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
import { toast } from "sonner";

interface City {
  id: string;
  name: string;
  country: string;
  description: string | null;
  image_url: string | null;
  avg_daily_budget_inr: number;
  best_season: string | null;
}

import { citiesData } from '@/data/cities';

export default function Explore() {
  const { user } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      let { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');

      if (error) throw error;

      if (!data || data.length < 50) {
        // Fallback: If seeding fails (403), merge local data for display
        console.log('Using local data for display due to low DB count.');

        const existingNames = new Set((data || []).map(c => c.name));
        const missingCities = citiesData
          .filter(c => !existingNames.has(c.name))
          .map(c => ({
            ...c,
            id: `seed-${c.name.toLowerCase().replace(/\s+/g, '-')}`, // Temp ID
            description: c.description || '',
            image_url: c.image_url || '',
            best_season: c.best_season || null
          } as City));

        data = [...(data as unknown as City[] || []), ...missingCities];
      }

      setCities((data as unknown as City[]) || []);
    } catch (err) {
      console.error('Error fetching cities:', err);
      // Fallback on error too
      const allLocal = citiesData.map(c => ({
        ...c,
        id: `seed-${c.name}`,
        description: c.description || '',
        image_url: c.image_url || '',
        best_season: c.best_season || null
      } as City));
      setCities(allLocal);
    } finally {
      setLoading(false);
    }
  };

  // Removed seedCities function
  // const seedCities = async () => {
  //   try {
  //     setSeeding(true);
  //     const { error } = await supabase
  //       .from('cities')
  //       .upsert(citiesData, { onConflict: 'name' });

  //     if (error) throw error;

  //     toast.success("Cities added!", {
  //       description: "Successfully loaded sample cities.",
  //     });
  //     fetchCities();
  //   } catch (err) {
  //     console.error('Error seeding cities:', err);
  //     toast.error("Error adding cities", {
  //       description: "Check console for details.",
  //     });
  //   } finally {
  //     setSeeding(false);
  //   }
  // };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4 drop-shadow-sm">
            Explore Destinations
          </h1>

        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl border-white/20 bg-white text-black placeholder:text-gray-500 focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
            />
          </div>
        </div>

        {/* Seed Button (Temporary) */}
        {/* Removed manual seed button */}
        {/* {cities.length < 50 && (
          <div className="text-center mb-8">
            <Button
              onClick={seedCities}
              disabled={seeding}
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading Data...
                </>
              ) : (
                <>
                  Load Sample Data ({citiesData.length} Cities)
                </>
              )}
            </Button>
          </div>
        )} */}

        {/* Cities Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="text-center py-20 bg-black/20 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <p className="text-white/70">No destinations found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCities.map((city) => (
              <div
                key={city.id}
                className="travel-card group overflow-hidden bg-black/20 backdrop-blur-md border border-white/10"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* City name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
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
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {city.description || 'Explore this beautiful destination'}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-5">
                    <div className="flex items-center gap-1.5 text-white/70">
                      <Wallet className="w-4 h-4 text-primary" />
                      <span>~₹{city.avg_daily_budget_inr.toLocaleString('en-IN')}/day</span>
                    </div>
                    {city.best_season && (
                      <div className="flex items-center gap-1.5 text-white/70">
                        <Sun className="w-4 h-4 text-accent" />
                        <span>{city.best_season}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    asChild
                    variant={user ? 'hero' : 'outline'}
                    className={user ? "w-full shadow-lg" : "w-full border-white/20 text-white hover:bg-white/10 hover:text-white"}
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
  );
}
