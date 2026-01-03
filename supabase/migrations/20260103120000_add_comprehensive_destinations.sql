-- Add comprehensive destinations for India and International locations

-- Indian Destinations (States, Cities, Tourist Places)
INSERT INTO public.cities (name, country, description, image_url, avg_daily_budget_inr, best_season) VALUES
-- South India
('Goa', 'India', 'Beach paradise with Portuguese heritage', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', 5000, 'November to February'),
('Kerala', 'India', 'God''s Own Country - Backwaters and hill stations', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', 4500, 'September to March'),
('Ooty', 'India', 'Queen of Hill Stations in Tamil Nadu', 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800', 3500, 'April to June'),
('Bangalore', 'India', 'Garden City and IT Hub', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800', 4000, 'Year Round'),
('Mysore', 'India', 'City of Palaces', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', 3000, 'October to February'),
('Chennai', 'India', 'Gateway to South India', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', 3500, 'November to February'),
('Coorg', 'India', 'Scotland of India', 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=800', 4000, 'October to March'),
('Pondicherry', 'India', 'French Colonial Town', 'https://images.unsplash.com/photo-1590649940414-5c4c24c2d120?w=800', 3000, 'November to March'),

-- North India
('Jaipur', 'India', 'Pink City with royal heritage', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', 4000, 'October to March'),
('Delhi', 'India', 'Capital city with rich history', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 4500, 'October to March'),
('Agra', 'India', 'Home of the Taj Mahal', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', 3500, 'October to March'),
('Udaipur', 'India', 'City of Lakes', 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800', 4000, 'September to March'),
('Jaisalmer', 'India', 'Golden City in Thar Desert', 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800', 3500, 'November to February'),
('Jodhpur', 'India', 'Blue City', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800', 3500, 'October to March'),
('Varanasi', 'India', 'Spiritual capital of India', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', 3000, 'October to March'),
('Amritsar', 'India', 'Home of Golden Temple', 'https://images.unsplash.com/photo-1595065049465-caee9b619be5?w=800', 3000, 'October to March'),

-- Himalayan Region
('Manali', 'India', 'Hill station in Himachal Pradesh', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 4500, 'March to June, September to December'),
('Shimla', 'India', 'Queen of Hills', 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800', 4000, 'March to June'),
('Ladakh', 'India', 'Land of High Passes', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 5500, 'May to September'),
('Leh', 'India', 'Capital of Ladakh', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 5000, 'June to September'),
('Dharamshala', 'India', 'Home of Dalai Lama', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3500, 'March to June'),
('Rishikesh', 'India', 'Yoga Capital of the World', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3000, 'September to April'),
('Mussoorie', 'India', 'Queen of Hills in Uttarakhand', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3500, 'April to June'),
('Nainital', 'India', 'Lake District of India', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3500, 'March to June'),

-- East India
('Kolkata', 'India', 'Cultural capital of India', 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', 3500, 'October to March'),
('Darjeeling', 'India', 'Queen of the Himalayas', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3500, 'March to May'),
('Gangtok', 'India', 'Capital of Sikkim', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 4000, 'March to June'),
('Puri', 'India', 'Holy city with beaches', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3000, 'October to March'),

-- West India
('Mumbai', 'India', 'City of Dreams', 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800', 5000, 'November to February'),
('Pune', 'India', 'Oxford of the East', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 3500, 'October to February'),
('Ahmedabad', 'India', 'Heritage city of Gujarat', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 3000, 'November to February'),
('Lonavala', 'India', 'Hill station near Mumbai', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3500, 'June to September'),
('Mount Abu', 'India', 'Only hill station in Rajasthan', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3500, 'October to March'),

-- Central India
('Bhopal', 'India', 'City of Lakes', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 3000, 'October to March'),
('Indore', 'India', 'Commercial capital of Madhya Pradesh', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 3000, 'October to March'),
('Khajuraho', 'India', 'Famous for ancient temples', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 3500, 'September to March'),

-- Northeast India
('Guwahati', 'India', 'Gateway to Northeast', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 3500, 'October to April'),
('Shillong', 'India', 'Scotland of the East', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 3500, 'September to May'),
('Kaziranga', 'India', 'Home of One-horned Rhino', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 4000, 'November to April'),

-- International Destinations
('Dubai', 'United Arab Emirates', 'Luxury and modern architecture', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 12000, 'November to March'),
('Bangkok', 'Thailand', 'Vibrant city with temples and nightlife', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 6000, 'November to February'),
('Singapore', 'Singapore', 'Garden city and shopping hub', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', 15000, 'February to April'),
('Bali', 'Indonesia', 'Island paradise', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 8000, 'April to October'),
('Maldives', 'Maldives', 'Tropical paradise', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 20000, 'November to April'),
('Paris', 'France', 'City of Love', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 18000, 'April to October'),
('London', 'United Kingdom', 'Historic capital', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', 20000, 'May to September'),
('New York', 'United States', 'The Big Apple', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', 25000, 'April to June, September to November'),
('Tokyo', 'Japan', 'Modern metropolis', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 15000, 'March to May, September to November'),
('Sydney', 'Australia', 'Harbour city', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', 18000, 'September to November, February to May'),
('Kathmandu', 'Nepal', 'Gateway to Himalayas', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 4000, 'September to November'),
('Colombo', 'Sri Lanka', 'Pearl of Indian Ocean', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 5000, 'December to March');
