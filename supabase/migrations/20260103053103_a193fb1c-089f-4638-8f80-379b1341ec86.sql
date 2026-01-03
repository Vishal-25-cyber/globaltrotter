-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create cities table (reference data)
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  avg_daily_budget_inr INTEGER DEFAULT 5000,
  best_season TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on cities (public read)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON public.cities FOR SELECT USING (true);

-- Create tourist_places table (reference data linked to cities)
CREATE TABLE public.tourist_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'attraction',
  avg_time_hours NUMERIC(3,1) DEFAULT 2,
  entry_fee_inr INTEGER DEFAULT 0,
  best_time_to_visit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on tourist_places (public read)
ALTER TABLE public.tourist_places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tourist places are viewable by everyone" ON public.tourist_places FOR SELECT USING (true);

-- Create trips table (user-specific)
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
  total_budget_inr INTEGER DEFAULT 0,
  notes TEXT,
  is_public BOOLEAN DEFAULT false,
  share_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Trip policies
CREATE POLICY "Users can view their own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public trips are viewable by everyone" ON public.trips FOR SELECT USING (is_public = true);

-- Create itinerary_items table (day-wise activities)
CREATE TABLE public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  tourist_place_id UUID REFERENCES public.tourist_places(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL,
  start_time TIME,
  end_time TIME,
  activity_name TEXT NOT NULL,
  activity_description TEXT,
  estimated_cost_inr INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on itinerary_items
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- Itinerary items policies (inherit from trip access)
CREATE POLICY "Users can view itinerary items of their trips" ON public.itinerary_items 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_items.trip_id AND (trips.user_id = auth.uid() OR trips.is_public = true))
  );
CREATE POLICY "Users can create itinerary items for their trips" ON public.itinerary_items 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_items.trip_id AND trips.user_id = auth.uid())
  );
CREATE POLICY "Users can update itinerary items of their trips" ON public.itinerary_items 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_items.trip_id AND trips.user_id = auth.uid())
  );
CREATE POLICY "Users can delete itinerary items of their trips" ON public.itinerary_items 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_items.trip_id AND trips.user_id = auth.uid())
  );

-- Create budget_items table for detailed budget breakdown
CREATE TABLE public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'transport', 'food', 'activities', 'shopping', 'miscellaneous')),
  description TEXT NOT NULL,
  amount_inr INTEGER NOT NULL,
  is_estimated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on budget_items
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;

-- Budget items policies
CREATE POLICY "Users can view budget items of their trips" ON public.budget_items 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = budget_items.trip_id AND (trips.user_id = auth.uid() OR trips.is_public = true))
  );
CREATE POLICY "Users can create budget items for their trips" ON public.budget_items 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = budget_items.trip_id AND trips.user_id = auth.uid())
  );
CREATE POLICY "Users can update budget items of their trips" ON public.budget_items 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = budget_items.trip_id AND trips.user_id = auth.uid())
  );
CREATE POLICY "Users can delete budget items of their trips" ON public.budget_items 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = budget_items.trip_id AND trips.user_id = auth.uid())
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate share code function
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_public = true AND NEW.share_code IS NULL THEN
    NEW.share_code = substr(md5(random()::text), 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_trip_share_code
  BEFORE INSERT OR UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.generate_share_code();