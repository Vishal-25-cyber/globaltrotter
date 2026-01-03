const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { pool, initializeDatabase } = require('./db-sqlite.cjs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize database
try {
  initializeDatabase();
} catch (error) {
  console.error('Database initialization error:', error);
}

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (id, email, password, full_name) VALUES (?, ?, ?, ?)',
      [id, email, hashedPassword, full_name]
    );
    
    res.json({ id, email, full_name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ id: user.id, email: user.email, full_name: user.full_name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cities endpoints
app.get('/api/cities', async (req, res) => {
  try {
    const [cities] = await pool.query('SELECT * FROM cities ORDER BY name');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cities/:id', async (req, res) => {
  try {
    const [cities] = await pool.query('SELECT * FROM cities WHERE id = ?', [req.params.id]);
    res.json(cities[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tourist places endpoints
app.get('/api/tourist-places', async (req, res) => {
  try {
    const { city_id } = req.query;
    const [places] = await pool.query(
      'SELECT * FROM tourist_places WHERE city_id = ? ORDER BY category',
      [city_id]
    );
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trips endpoints
app.get('/api/trips', async (req, res) => {
  try {
    const { user_id } = req.query;
    const [trips] = await pool.query(
      'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trips/:id', async (req, res) => {
  try {
    const trips = await pool.query('SELECT * FROM trips WHERE id = ?', [req.params.id]);
    if (!trips || trips.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    const trip = trips[0];
    
    // Get the city information
    const cities = await pool.query('SELECT * FROM cities WHERE id = ?', [trip.destination_city_id]);
    if (cities && cities.length > 0) {
      trip.city = cities[0];
    }
    
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trip by share code (for public sharing)
app.get('/api/trips/shared/:shareCode', async (req, res) => {
  try {
    const [trips] = await pool.query(
      'SELECT * FROM trips WHERE share_code = ? AND is_public = true',
      [req.params.shareCode]
    );
    if (trips.length === 0) {
      return res.status(404).json({ error: 'Trip not found or not public' });
    }
    res.json(trips[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trips', async (req, res) => {
  try {
    const { user_id, city_id, title, start_date, end_date, total_budget_inr, notes } = req.body;
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO trips (id, user_id, city_id, title, start_date, end_date, total_budget_inr, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user_id, city_id, title, start_date, end_date, total_budget_inr, notes]
    );
    
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/trips/:id', async (req, res) => {
  try {
    const { title, status, notes, is_public } = req.body;
    await pool.query(
      'UPDATE trips SET title = ?, status = ?, notes = ?, is_public = ? WHERE id = ?',
      [title, status, notes, is_public, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/trips/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM trips WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Itinerary items endpoints
app.get('/api/itinerary-items', async (req, res) => {
  try {
    const { trip_id } = req.query;
    const [items] = await pool.query(
      'SELECT * FROM itinerary_items WHERE trip_id = ? ORDER BY day_number, order_index',
      [trip_id]
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/itinerary-items', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    
    for (const item of items) {
      const id = uuidv4();
      await pool.query(
        'INSERT INTO itinerary_items (id, trip_id, tourist_place_id, day_number, start_time, end_time, activity_name, activity_description, estimated_cost_inr, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, item.trip_id, item.tourist_place_id, item.day_number, item.start_time, item.end_time, item.activity_name, item.activity_description, item.estimated_cost_inr, item.order_index]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Budget items endpoints
app.get('/api/budget-items', async (req, res) => {
  try {
    const { trip_id } = req.query;
    const [items] = await pool.query(
      'SELECT * FROM budget_items WHERE trip_id = ?',
      [trip_id]
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/budget-items', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    
    for (const item of items) {
      const id = uuidv4();
      await pool.query(
        'INSERT INTO budget_items (id, trip_id, category, description, amount_inr, is_estimated) VALUES (?, ?, ?, ?, ?, ?)',
        [id, item.trip_id, item.category, item.description, item.amount_inr, item.is_estimated]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
