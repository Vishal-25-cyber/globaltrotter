const Database = require('better-sqlite3');
const path = require('path');

// Create database file in server directory
const dbPath = path.join(__dirname, 'travel_app.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initializeDatabase() {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create cities table
    db.exec(`
      CREATE TABLE IF NOT EXISTS cities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        state TEXT,
        district TEXT,
        description TEXT,
        image_url TEXT,
        avg_daily_budget_inr INTEGER DEFAULT 5000,
        best_season TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for cities
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
      CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country);
      CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state);
      CREATE INDEX IF NOT EXISTS idx_cities_district ON cities(district);
    `);
    
    // Create tourist_places table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tourist_places (
        id TEXT PRIMARY KEY,
        city_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        category TEXT,
        rating REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES cities(id)
      )
    `);
    
    // Create index for tourist places
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_tourist_places_city ON tourist_places(city_id);
    `);
    
    // Create trips table
    db.exec(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        destination_city_id TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        budget REAL,
        status TEXT DEFAULT 'planned',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (destination_city_id) REFERENCES cities(id)
      )
    `);
    
    // Create trip_places table (many-to-many)
    db.exec(`
      CREATE TABLE IF NOT EXISTS trip_places (
        trip_id TEXT NOT NULL,
        place_id TEXT NOT NULL,
        visit_date DATE,
        notes TEXT,
        PRIMARY KEY (trip_id, place_id),
        FOREIGN KEY (trip_id) REFERENCES trips(id),
        FOREIGN KEY (place_id) REFERENCES tourist_places(id)
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Helper function to run queries (compatible with mysql2 promise style)
const query = (sql, params = []) => {
  try {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      return Promise.resolve([rows]);
    } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
      const stmt = db.prepare(sql);
      const info = stmt.run(...params);
      return Promise.resolve([{ insertId: info.lastInsertRowid }]);
    } else {
      const stmt = db.prepare(sql);
      const info = stmt.run(...params);
      return Promise.resolve([{ affectedRows: info.changes }]);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const pool = {
  query,
  getConnection: () => Promise.resolve({ query, release: () => {} })
};

module.exports = {
  pool,
  initializeDatabase,
  db
};
