import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmadnfadkvkgcshnsnmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYWRuZmFka3ZrZ2NzaG5zbm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MTI3NDMsImV4cCI6MjA4Mjk4ODc0M30.20gvGpQ8cjWZJmh3uH4WbBSLJA_fRi9rBWFn5JneM24';
const supabase = createClient(supabaseUrl, supabaseKey);

const destinations = [
  // South India
  { name: 'Goa', country: 'India', description: 'Beach paradise with Portuguese heritage', image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', avg_daily_budget_inr: 5000, best_season: 'November to February' },
  { name: 'Kerala', country: 'India', description: "God's Own Country - Backwaters and hill stations", image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', avg_daily_budget_inr: 4500, best_season: 'September to March' },
  { name: 'Ooty', country: 'India', description: 'Queen of Hill Stations in Tamil Nadu', image_url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800', avg_daily_budget_inr: 3500, best_season: 'April to June' },
  { name: 'Bangalore', country: 'India', description: 'Garden City and IT Hub', image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800', avg_daily_budget_inr: 4000, best_season: 'Year Round' },
  { name: 'Mysore', country: 'India', description: 'City of Palaces', image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', avg_daily_budget_inr: 3000, best_season: 'October to February' },
  { name: 'Chennai', country: 'India', description: 'Gateway to South India', image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', avg_daily_budget_inr: 3500, best_season: 'November to February' },
  { name: 'Coorg', country: 'India', description: 'Scotland of India', image_url: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=800', avg_daily_budget_inr: 4000, best_season: 'October to March' },
  { name: 'Pondicherry', country: 'India', description: 'French Colonial Town', image_url: 'https://images.unsplash.com/photo-1590649940414-5c4c24c2d120?w=800', avg_daily_budget_inr: 3000, best_season: 'November to March' },
  
  // North India
  { name: 'Jaipur', country: 'India', description: 'Pink City with royal heritage', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', avg_daily_budget_inr: 4000, best_season: 'October to March' },
  { name: 'Delhi', country: 'India', description: 'Capital city with rich history', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 4500, best_season: 'October to March' },
  { name: 'Agra', country: 'India', description: 'Home of the Taj Mahal', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Udaipur', country: 'India', description: 'City of Lakes', image_url: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800', avg_daily_budget_inr: 4000, best_season: 'September to March' },
  { name: 'Jaisalmer', country: 'India', description: 'Golden City in Thar Desert', image_url: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800', avg_daily_budget_inr: 3500, best_season: 'November to February' },
  { name: 'Jodhpur', country: 'India', description: 'Blue City', image_url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Varanasi', country: 'India', description: 'Spiritual capital of India', image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Amritsar', country: 'India', description: 'Home of Golden Temple', image_url: 'https://images.unsplash.com/photo-1595065049465-caee9b619be5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  
  // Himalayan Region
  { name: 'Manali', country: 'India', description: 'Hill station in Himachal Pradesh', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4500, best_season: 'March to June, September to December' },
  { name: 'Shimla', country: 'India', description: 'Queen of Hills', image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800', avg_daily_budget_inr: 4000, best_season: 'March to June' },
  { name: 'Ladakh', country: 'India', description: 'Land of High Passes', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', avg_daily_budget_inr: 5500, best_season: 'May to September' },
  { name: 'Leh', country: 'India', description: 'Capital of Ladakh', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 5000, best_season: 'June to September' },
  { name: 'Dharamshala', country: 'India', description: 'Home of Dalai Lama', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  { name: 'Rishikesh', country: 'India', description: 'Yoga Capital of the World', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3000, best_season: 'September to April' },
  { name: 'Mussoorie', country: 'India', description: 'Queen of Hills in Uttarakhand', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'April to June' },
  { name: 'Nainital', country: 'India', description: 'Lake District of India', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  
  // East India
  { name: 'Kolkata', country: 'India', description: 'Cultural capital of India', image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Darjeeling', country: 'India', description: 'Queen of the Himalayas', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to May' },
  { name: 'Gangtok', country: 'India', description: 'Capital of Sikkim', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'March to June' },
  { name: 'Puri', country: 'India', description: 'Holy city with beaches', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  
  // West India
  { name: 'Mumbai', country: 'India', description: 'City of Dreams', image_url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800', avg_daily_budget_inr: 5000, best_season: 'November to February' },
  { name: 'Pune', country: 'India', description: 'Oxford of the East', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to February' },
  { name: 'Ahmedabad', country: 'India', description: 'Heritage city of Gujarat', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'November to February' },
  { name: 'Lonavala', country: 'India', description: 'Hill station near Mumbai', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'June to September' },
  { name: 'Mount Abu', country: 'India', description: 'Only hill station in Rajasthan', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  
  // Central India
  { name: 'Bhopal', country: 'India', description: 'City of Lakes', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Indore', country: 'India', description: 'Commercial capital of Madhya Pradesh', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Khajuraho', country: 'India', description: 'Famous for ancient temples', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'September to March' },
  
  // Northeast India
  { name: 'Guwahati', country: 'India', description: 'Gateway to Northeast', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to April' },
  { name: 'Shillong', country: 'India', description: 'Scotland of the East', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'September to May' },
  { name: 'Kaziranga', country: 'India', description: 'Home of One-horned Rhino', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'November to April' },
  
  // International Destinations
  { name: 'Dubai', country: 'United Arab Emirates', description: 'Luxury and modern architecture', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', avg_daily_budget_inr: 12000, best_season: 'November to March' },
  { name: 'Bangkok', country: 'Thailand', description: 'Vibrant city with temples and nightlife', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', avg_daily_budget_inr: 6000, best_season: 'November to February' },
  { name: 'Singapore', country: 'Singapore', description: 'Garden city and shopping hub', image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', avg_daily_budget_inr: 15000, best_season: 'February to April' },
  { name: 'Bali', country: 'Indonesia', description: 'Island paradise', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', avg_daily_budget_inr: 8000, best_season: 'April to October' },
  { name: 'Maldives', country: 'Maldives', description: 'Tropical paradise', image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', avg_daily_budget_inr: 20000, best_season: 'November to April' },
  { name: 'Paris', country: 'France', description: 'City of Love', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', avg_daily_budget_inr: 18000, best_season: 'April to October' },
  { name: 'London', country: 'United Kingdom', description: 'Historic capital', image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', avg_daily_budget_inr: 20000, best_season: 'May to September' },
  { name: 'New York', country: 'United States', description: 'The Big Apple', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', avg_daily_budget_inr: 25000, best_season: 'April to June, September to November' },
  { name: 'Tokyo', country: 'Japan', description: 'Modern metropolis', image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', avg_daily_budget_inr: 15000, best_season: 'March to May, September to November' },
  { name: 'Sydney', country: 'Australia', description: 'Harbour city', image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', avg_daily_budget_inr: 18000, best_season: 'September to November, February to May' },
  { name: 'Kathmandu', country: 'Nepal', description: 'Gateway to Himalayas', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'September to November' },
  { name: 'Colombo', country: 'Sri Lanka', description: 'Pearl of Indian Ocean', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 5000, best_season: 'December to March' }
];

async function insertDestinations() {
  console.log('Starting to insert destinations...');
  
  const { data, error } = await supabase
    .from('cities')
    .insert(destinations)
    .select();

  if (error) {
    console.error('Error inserting destinations:', error);
  } else {
    console.log(`Successfully inserted ${data.length} destinations!`);
  }
}

insertDestinations();
