const { pool, initializeDatabase } = require('./db.cjs');
const { v4: uuidv4 } = require('uuid');

const destinations = [
  // South India
  { name: 'Goa', country: 'India', state: 'Goa', district: 'North Goa', description: 'Beach paradise with Portuguese heritage', image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', avg_daily_budget_inr: 5000, best_season: 'November to February' },
  { name: 'Kerala', country: 'India', state: 'Kerala', district: 'Alappuzha', description: "God's Own Country - Backwaters and hill stations", image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', avg_daily_budget_inr: 4500, best_season: 'September to March' },
  { name: 'Ooty', country: 'India', state: 'Tamil Nadu', district: 'Nilgiris', description: 'Queen of Hill Stations', image_url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800', avg_daily_budget_inr: 3500, best_season: 'April to June' },
  { name: 'Bangalore', country: 'India', state: 'Karnataka', district: 'Bangalore Urban', description: 'Garden City and IT Hub', image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800', avg_daily_budget_inr: 4000, best_season: 'Year Round' },
  { name: 'Mysore', country: 'India', state: 'Karnataka', district: 'Mysuru', description: 'City of Palaces', image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', avg_daily_budget_inr: 3000, best_season: 'October to February' },
  { name: 'Chennai', country: 'India', state: 'Tamil Nadu', district: 'Chennai', description: 'Gateway to South India', image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', avg_daily_budget_inr: 3500, best_season: 'November to February' },
  { name: 'Coorg', country: 'India', state: 'Karnataka', district: 'Kodagu', description: 'Scotland of India', image_url: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=800', avg_daily_budget_inr: 4000, best_season: 'October to March' },
  { name: 'Pondicherry', country: 'India', state: 'Puducherry', district: 'Puducherry', description: 'French Colonial Town', image_url: 'https://images.unsplash.com/photo-1590649940414-5c4c24c2d120?w=800', avg_daily_budget_inr: 3000, best_season: 'November to March' },
  { name: 'Hyderabad', country: 'India', state: 'Telangana', district: 'Hyderabad', description: 'City of Pearls', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Visakhapatnam', country: 'India', state: 'Andhra Pradesh', district: 'Visakhapatnam', description: 'City of Destiny', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Kochi', country: 'India', state: 'Kerala', district: 'Ernakulam', description: 'Queen of Arabian Sea', image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', avg_daily_budget_inr: 4000, best_season: 'September to March' },
  { name: 'Munnar', country: 'India', state: 'Kerala', district: 'Idukki', description: 'Tea Garden Paradise', image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', avg_daily_budget_inr: 4000, best_season: 'September to May' },
  { name: 'Wayanad', country: 'India', state: 'Kerala', district: 'Wayanad', description: 'Green Paradise', image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', avg_daily_budget_inr: 3500, best_season: 'October to May' },
  { name: 'Madurai', country: 'India', state: 'Tamil Nadu', district: 'Madurai', description: 'Temple City', image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Kodaikanal', country: 'India', state: 'Tamil Nadu', district: 'Dindigul', description: 'Princess of Hill Stations', image_url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800', avg_daily_budget_inr: 3500, best_season: 'April to June' },
  { name: 'Rameshwaram', country: 'India', state: 'Tamil Nadu', district: 'Ramanathapuram', description: 'Sacred Island Town', image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', avg_daily_budget_inr: 3000, best_season: 'October to April' },
  { name: 'Hampi', country: 'India', state: 'Karnataka', district: 'Vijayanagara', description: 'Ancient Ruins', image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', avg_daily_budget_inr: 3000, best_season: 'October to February' },
  
  // North India
  { name: 'Jaipur', country: 'India', state: 'Rajasthan', district: 'Jaipur', description: 'Pink City', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', avg_daily_budget_inr: 4000, best_season: 'October to March' },
  { name: 'Delhi', country: 'India', state: 'Delhi', district: 'New Delhi', description: 'Capital City', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 4500, best_season: 'October to March' },
  { name: 'Agra', country: 'India', state: 'Uttar Pradesh', district: 'Agra', description: 'Home of Taj Mahal', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Udaipur', country: 'India', state: 'Rajasthan', district: 'Udaipur', description: 'City of Lakes', image_url: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800', avg_daily_budget_inr: 4000, best_season: 'September to March' },
  { name: 'Jaisalmer', country: 'India', state: 'Rajasthan', district: 'Jaisalmer', description: 'Golden City', image_url: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800', avg_daily_budget_inr: 3500, best_season: 'November to February' },
  { name: 'Jodhpur', country: 'India', state: 'Rajasthan', district: 'Jodhpur', description: 'Blue City', image_url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Varanasi', country: 'India', state: 'Uttar Pradesh', district: 'Varanasi', description: 'Spiritual Capital', image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Amritsar', country: 'India', state: 'Punjab', district: 'Amritsar', description: 'Golden Temple City', image_url: 'https://images.unsplash.com/photo-1595065049465-caee9b619be5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Lucknow', country: 'India', state: 'Uttar Pradesh', district: 'Lucknow', description: 'City of Nawabs', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Mathura', country: 'India', state: 'Uttar Pradesh', district: 'Mathura', description: 'Birthplace of Krishna', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Vrindavan', country: 'India', state: 'Uttar Pradesh', district: 'Mathura', description: 'Land of Krishna', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Pushkar', country: 'India', state: 'Rajasthan', district: 'Ajmer', description: 'Holy Lake Town', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Mount Abu', country: 'India', state: 'Rajasthan', district: 'Sirohi', description: 'Hill Station in Desert', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Bikaner', country: 'India', state: 'Rajasthan', district: 'Bikaner', description: 'Camel Country', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  
  // Himalayan Region
  { name: 'Manali', country: 'India', state: 'Himachal Pradesh', district: 'Kullu', description: 'Valley of Gods', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4500, best_season: 'March to June, September to December' },
  { name: 'Shimla', country: 'India', state: 'Himachal Pradesh', district: 'Shimla', description: 'Queen of Hills', image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800', avg_daily_budget_inr: 4000, best_season: 'March to June' },
  { name: 'Ladakh', country: 'India', state: 'Ladakh', district: 'Leh', description: 'Land of High Passes', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', avg_daily_budget_inr: 5500, best_season: 'May to September' },
  { name: 'Leh', country: 'India', state: 'Ladakh', district: 'Leh', description: 'Capital of Ladakh', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 5000, best_season: 'June to September' },
  { name: 'Dharamshala', country: 'India', state: 'Himachal Pradesh', district: 'Kangra', description: 'Little Lhasa', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  { name: 'Rishikesh', country: 'India', state: 'Uttarakhand', district: 'Dehradun', description: 'Yoga Capital', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3000, best_season: 'September to April' },
  { name: 'Mussoorie', country: 'India', state: 'Uttarakhand', district: 'Dehradun', description: 'Queen of Uttarakhand', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'April to June' },
  { name: 'Nainital', country: 'India', state: 'Uttarakhand', district: 'Nainital', description: 'Lake District', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  { name: 'Haridwar', country: 'India', state: 'Uttarakhand', district: 'Haridwar', description: 'Gateway to Gods', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3000, best_season: 'September to April' },
  { name: 'Kasauli', country: 'India', state: 'Himachal Pradesh', district: 'Solan', description: 'Cantonment Town', image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  { name: 'Dalhousie', country: 'India', state: 'Himachal Pradesh', district: 'Chamba', description: 'Swiss of India', image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  { name: 'Spiti Valley', country: 'India', state: 'Himachal Pradesh', district: 'Lahaul and Spiti', description: 'Cold Desert', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 5000, best_season: 'June to September' },
  { name: 'Auli', country: 'India', state: 'Uttarakhand', district: 'Chamoli', description: 'Skiing Paradise', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4500, best_season: 'November to March' },
  { name: 'Jim Corbett', country: 'India', state: 'Uttarakhand', district: 'Nainital', description: 'Wildlife Paradise', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'November to June' },
  { name: 'Kufri', country: 'India', state: 'Himachal Pradesh', district: 'Shimla', description: 'Winter Wonderland', image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800', avg_daily_budget_inr: 3500, best_season: 'December to February' },
  
  // East India
  { name: 'Kolkata', country: 'India', state: 'West Bengal', district: 'Kolkata', description: 'Cultural Capital', image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Darjeeling', country: 'India', state: 'West Bengal', district: 'Darjeeling', description: 'Queen of Himalayas', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to May' },
  { name: 'Gangtok', country: 'India', state: 'Sikkim', district: 'East Sikkim', description: 'Gateway to Sikkim', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'March to June' },
  { name: 'Puri', country: 'India', state: 'Odisha', district: 'Puri', description: 'Jagannath Dham', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Bhubaneswar', country: 'India', state: 'Odisha', district: 'Khordha', description: 'Temple City', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Digha', country: 'India', state: 'West Bengal', district: 'Purba Medinipur', description: 'Beach Town', image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Kalimpong', country: 'India', state: 'West Bengal', district: 'Kalimpong', description: 'Hill Station', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  { name: 'Siliguri', country: 'India', state: 'West Bengal', district: 'Darjeeling', description: 'Gateway to Northeast', image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Pelling', country: 'India', state: 'Sikkim', district: 'West Sikkim', description: 'Himalayan Views', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'March to June' },
  { name: 'Sundarbans', country: 'India', state: 'West Bengal', district: 'South 24 Parganas', description: 'Mangrove Forest', image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', avg_daily_budget_inr: 4000, best_season: 'September to March' },
  
  // West India
  { name: 'Mumbai', country: 'India', state: 'Maharashtra', district: 'Mumbai City', description: 'City of Dreams', image_url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800', avg_daily_budget_inr: 5000, best_season: 'November to February' },
  { name: 'Pune', country: 'India', state: 'Maharashtra', district: 'Pune', description: 'Oxford of the East', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to February' },
  { name: 'Ahmedabad', country: 'India', state: 'Gujarat', district: 'Ahmedabad', description: 'Heritage City', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'November to February' },
  { name: 'Lonavala', country: 'India', state: 'Maharashtra', district: 'Pune', description: 'Hill Station', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'June to September' },
  { name: 'Mahabaleshwar', country: 'India', state: 'Maharashtra', district: 'Satara', description: 'Strawberry Town', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'October to June' },
  { name: 'Aurangabad', country: 'India', state: 'Maharashtra', district: 'Aurangabad', description: 'City of Gates', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Nashik', country: 'India', state: 'Maharashtra', district: 'Nashik', description: 'Wine Capital', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Surat', country: 'India', state: 'Gujarat', district: 'Surat', description: 'Diamond City', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'November to February' },
  { name: 'Vadodara', country: 'India', state: 'Gujarat', district: 'Vadodara', description: 'Cultural Capital of Gujarat', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'November to February' },
  { name: 'Somnath', country: 'India', state: 'Gujarat', district: 'Gir Somnath', description: 'Temple Town', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'November to February' },
  { name: 'Dwarka', country: 'India', state: 'Gujarat', district: 'Devbhoomi Dwarka', description: 'Krishna City', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Rann of Kutch', country: 'India', state: 'Gujarat', district: 'Kutch', description: 'White Desert', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 4000, best_season: 'November to February' },
  { name: 'Alibaug', country: 'India', state: 'Maharashtra', district: 'Raigad', description: 'Beach Paradise', image_url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800', avg_daily_budget_inr: 3500, best_season: 'November to March' },
  
  // Central India
  { name: 'Bhopal', country: 'India', state: 'Madhya Pradesh', district: 'Bhopal', description: 'City of Lakes', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Indore', country: 'India', state: 'Madhya Pradesh', district: 'Indore', description: 'Commercial Capital', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Khajuraho', country: 'India', state: 'Madhya Pradesh', district: 'Chhatarpur', description: 'Temple Town', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'September to March' },
  { name: 'Ujjain', country: 'India', state: 'Madhya Pradesh', district: 'Ujjain', description: 'Temple City', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Gwalior', country: 'India', state: 'Madhya Pradesh', district: 'Gwalior', description: 'Historic Fort City', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Pachmarhi', country: 'India', state: 'Madhya Pradesh', district: 'Hoshangabad', description: 'Queen of Satpura', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'October to June' },
  { name: 'Omkareshwar', country: 'India', state: 'Madhya Pradesh', district: 'Khandwa', description: 'Island Temple', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Raipur', country: 'India', state: 'Chhattisgarh', district: 'Raipur', description: 'Rice Bowl', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  
  // Northeast India
  { name: 'Guwahati', country: 'India', state: 'Assam', district: 'Kamrup Metropolitan', description: 'Gateway to Northeast', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to April' },
  { name: 'Shillong', country: 'India', state: 'Meghalaya', district: 'East Khasi Hills', description: 'Scotland of the East', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'September to May' },
  { name: 'Kaziranga', country: 'India', state: 'Assam', district: 'Golaghat', description: 'Rhino Sanctuary', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'November to April' },
  { name: 'Cherrapunji', country: 'India', state: 'Meghalaya', district: 'East Khasi Hills', description: 'Wettest Place', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3500, best_season: 'September to May' },
  { name: 'Tawang', country: 'India', state: 'Arunachal Pradesh', district: 'Tawang', description: 'Monastery Town', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'March to October' },
  { name: 'Imphal', country: 'India', state: 'Manipur', district: 'Imphal West', description: 'Jewel of India', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Agartala', country: 'India', state: 'Tripura', district: 'West Tripura', description: 'City of Temples', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3000, best_season: 'October to March' },
  { name: 'Kohima', country: 'India', state: 'Nagaland', district: 'Kohima', description: 'Land of Warriors', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to May' },
  { name: 'Aizawl', country: 'India', state: 'Mizoram', district: 'Aizawl', description: 'Land of Blue Mountains', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to March' },
  { name: 'Itanagar', country: 'India', state: 'Arunachal Pradesh', district: 'Papum Pare', description: 'Land of Rising Sun', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', avg_daily_budget_inr: 3500, best_season: 'October to April' },
  { name: 'Majuli', country: 'India', state: 'Assam', district: 'Majuli', description: 'River Island', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 3000, best_season: 'November to March' },
  
  // International
  { name: 'Dubai', country: 'United Arab Emirates', state: 'Dubai', district: 'Dubai', description: 'City of Gold', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', avg_daily_budget_inr: 12000, best_season: 'November to March' },
  { name: 'Bangkok', country: 'Thailand', state: 'Bangkok', district: 'Bangkok', description: 'City of Angels', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', avg_daily_budget_inr: 6000, best_season: 'November to February' },
  { name: 'Singapore', country: 'Singapore', state: 'Singapore', district: 'Singapore', description: 'Lion City', image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', avg_daily_budget_inr: 15000, best_season: 'February to April' },
  { name: 'Bali', country: 'Indonesia', state: 'Bali', district: 'Denpasar', description: 'Island Paradise', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', avg_daily_budget_inr: 8000, best_season: 'April to October' },
  { name: 'Maldives', country: 'Maldives', state: 'Male', district: 'Male', description: 'Tropical Paradise', image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', avg_daily_budget_inr: 20000, best_season: 'November to April' },
  { name: 'Paris', country: 'France', state: 'Ile-de-France', district: 'Paris', description: 'City of Love', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', avg_daily_budget_inr: 18000, best_season: 'April to October' },
  { name: 'London', country: 'United Kingdom', state: 'England', district: 'London', description: 'Historic Capital', image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', avg_daily_budget_inr: 20000, best_season: 'May to September' },
  { name: 'New York', country: 'United States', state: 'New York', district: 'New York City', description: 'The Big Apple', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', avg_daily_budget_inr: 25000, best_season: 'April to June, September to November' },
  { name: 'Tokyo', country: 'Japan', state: 'Tokyo', district: 'Tokyo', description: 'Modern Metropolis', image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', avg_daily_budget_inr: 15000, best_season: 'March to May, September to November' },
  { name: 'Sydney', country: 'Australia', state: 'New South Wales', district: 'Sydney', description: 'Harbour City', image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', avg_daily_budget_inr: 18000, best_season: 'September to November, February to May' },
  { name: 'Kathmandu', country: 'Nepal', state: 'Bagmati', district: 'Kathmandu', description: 'City of Temples', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 4000, best_season: 'September to November' },
  { name: 'Colombo', country: 'Sri Lanka', state: 'Western Province', district: 'Colombo', description: 'Pearl of Indian Ocean', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', avg_daily_budget_inr: 5000, best_season: 'December to March' },
  { name: 'Phuket', country: 'Thailand', state: 'Phuket', district: 'Phuket', description: 'Pearl of Andaman', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', avg_daily_budget_inr: 7000, best_season: 'November to April' },
  { name: 'Kuala Lumpur', country: 'Malaysia', state: 'Federal Territory', district: 'Kuala Lumpur', description: 'Garden City', image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800', avg_daily_budget_inr: 8000, best_season: 'December to February' }
];

async function populateDestinations() {
  await initializeDatabase();
  
  console.log('Populating destinations...');
  
  for (const dest of destinations) {
    const id = uuidv4();
    try {
      await pool.query(
        'INSERT INTO cities (id, name, country, state, district, description, image_url, avg_daily_budget_inr, best_season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, dest.name, dest.country, dest.state, dest.district, dest.description, dest.image_url, dest.avg_daily_budget_inr, dest.best_season]
      );
      console.log(`Added: ${dest.name}, ${dest.state}, ${dest.country}`);
    } catch (error) {
      if (error.code !== 'ER_DUP_ENTRY') {
        console.error(`Error adding ${dest.name}:`, error.message);
      }
    }
  }
  
  console.log(`\nSuccessfully populated ${destinations.length} destinations!`);
  process.exit(0);
}

populateDestinations();
