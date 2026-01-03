import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Globe } from '@/components/Globe';
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Share2, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mountain,
  Compass,
  Plane,
  Globe as GlobeIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: MapPin,
    title: 'Smart Destinations',
    description: 'Discover curated tourist places and hidden gems across India\'s most beautiful cities.',
  },
  {
    icon: Calendar,
    title: 'Day-wise Planning',
    description: 'Automatically generate optimized itineraries based on your travel dates and preferences.',
  },
  {
    icon: Wallet,
    title: 'Budget Tracking',
    description: 'Get detailed cost breakdowns in INR before you travel. No surprises, just adventures.',
  },
  {
    icon: Share2,
    title: 'Share Your Plans',
    description: 'Create shareable trip links for friends and family to view your complete itinerary.',
  },
];

const benefits = [
  'Single source of truth for all trip data',
  'No more scattered notes and spreadsheets',
  'Real-time budget visibility',
  'Easily collaborate with travel companions',
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Empowering Personalized Travel Planning
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance animate-fade-in-up">
                Plan Your Dream Trip with{' '}
                <span className="text-gradient-hero">GlobeTrotter</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Create personalized multi-city itineraries, track your budget in real-time, 
                and share your travel plans—all in one beautiful platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Button asChild variant="hero" size="xl">
                  <Link to={user ? '/dashboard' : '/auth?mode=signup'}>
                    {user ? 'Go to Dashboard' : 'Start Planning Free'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/explore">
                    Explore Destinations
                  </Link>
                </Button>
              </div>

              {/* Quick benefits */}
              <div className="mt-10 grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Globe illustration */}
            <div className="flex-1 flex justify-center lg:justify-end animate-scale-in">
              <Globe />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop juggling between notes, spreadsheets, and messaging apps. 
              GlobeTrotter brings all your travel planning into one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="travel-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Plan in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From destination to detailed itinerary in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
              <div key={item.step} className="relative text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
                )}
                
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-card border-2 border-border mb-6">
                  <span className="text-3xl font-bold text-gradient-hero">{item.step}</span>
                </div>

                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 animated-gradient" />
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                Join thousands of travelers who plan smarter with GlobeTrotter.
              </p>
              <Button asChild size="xl" className="bg-card text-foreground hover:bg-card/90 shadow-elevated">
                <Link to={user ? '/dashboard' : '/auth?mode=signup'}>
                  {user ? 'Plan a New Trip' : 'Create Free Account'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <GlobeIcon className="w-6 h-6 text-primary" />
                <MapPin className="w-3 h-3 text-accent absolute -top-0.5 -right-0.5" />
              </div>
              <span className="font-bold text-gradient-hero">GlobeTrotter</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 GlobeTrotter. Empowering personalized travel planning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
