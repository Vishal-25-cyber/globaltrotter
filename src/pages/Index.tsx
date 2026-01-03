import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Globe } from '@/components/Globe';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mountain,
  Compass,
  Plane,
  Globe as GlobeIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const benefits = [
  'Single source of truth for all trip data',
  'No more scattered notes and spreadsheets',
  'Real-time budget visibility',
  'Easily collaborate with travel companions',
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative font-sans text-white">
      {/* Global Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534008897995-27a23e859048?q=100&w=2600&auto=format&fit=crop")' }}
      />
      <div className="fixed inset-0 z-0 bg-black/40" /> {/* Removed blur for clarity */}

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Left content */}
              <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm font-medium mb-6 animate-fade-in shadow-lg">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Empowering Personalized Travel Planning
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 text-balance animate-fade-in-up drop-shadow-2xl">
                  Plan Your Dream Trip with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">TripNex</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed shadow-black/50 drop-shadow-md">
                  Discover new destinations, create detailed itineraries, and manage your budget—all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Button asChild className="bg-white text-black hover:bg-white/90 font-bold px-8 h-12 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                    <Link to={user ? '/dashboard' : '/auth'}>
                      {user ? 'Go to Dashboard' : 'Start Planning Free'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Quick benefits */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm md:text-base text-gray-100 bg-black/30 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Innovative Floating Gallery */}
              <div className="hidden lg:flex flex-1 justify-center lg:justify-end relative">
                <div className="relative w-[500px] h-[600px]">

                  {/* Card 1: Bali (Top Right) */}
                  <div className="absolute top-0 right-10 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-6 animate-float hover:z-50 transition-all hover:scale-110 hover:rotate-0" style={{ animationDelay: '0s' }}>
                    <img
                      src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80"
                      alt="Bali"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <p className="text-white font-bold text-sm">Bali, Indonesia</p>
                    </div>
                  </div>

                  {/* Card 2: Paris (Center Left) */}
                  <div className="absolute top-32 left-0 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform -rotate-12 animate-float hover:z-50 transition-all hover:scale-110 hover:rotate-0" style={{ animationDelay: '1.5s' }}>
                    <img
                      src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80"
                      alt="Paris"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <p className="text-white font-bold text-sm">Paris, France</p>
                    </div>
                  </div>

                  {/* Card 3: Kyoto (Bottom Center) */}
                  <div className="absolute bottom-10 right-20 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-3 animate-float hover:z-50 transition-all hover:scale-110 hover:rotate-0" style={{ animationDelay: '3s' }}>
                    <img
                      src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80"
                      alt="Kyoto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <p className="text-white font-bold text-sm">Kyoto, Japan</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-28 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                Plan in 3 Simple Steps
              </h2>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                From destination to detailed itinerary in minutes, not hours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  step: '01',
                  icon: Compass,
                  title: 'Choose Destination',
                  description: 'Select from popular Indian cities or search for your dream destination.',
                },
                {
                  step: '02',
                  icon: Mountain,
                  title: 'Pick Your Places',
                  description: 'Browse curated tourist spots and add your favorites to the trip.',
                },
                {
                  step: '03',
                  icon: Plane,
                  title: 'Get Your Plan',
                  description: 'Receive a day-wise itinerary with complete budget breakdown in INR.',
                },
              ].map((item, i) => (
                <div key={item.step} className="relative text-center p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-xl hover:bg-black/50 transition-colors group">
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-[5.5rem] -right-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                  )}

                  {/* Step number */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 mb-6 group-hover:scale-110 transition-transform z-10">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:rotate-6 transition-transform">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="container mx-auto px-4 text-center">

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <GlobeIcon className="w-8 h-8 text-white" />
                  <MapPin className="w-4 h-4 text-blue-400 absolute -top-0.5 -right-0.5" />
                </div>
                <span className="font-bold text-3xl text-white tracking-tight">TripNex</span>
              </div>

              <p className="text-sm text-gray-400">
                © 2025 TripNex. Empowering personalized travel planning.
              </p>
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
}
