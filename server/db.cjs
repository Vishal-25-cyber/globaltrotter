const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'vishal23csr240@',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  const connection = await pool.getConnection();
  
  try {
    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS travel_app');
    await connection.query('USE travel_app');
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create cities table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        state VARCHAR(255),
        district VARCHAR(255),
        description TEXT,
        image_url TEXT,
        avg_daily_budget_inr INT DEFAULT 5000,
        best_season VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_country (country),
        INDEX idx_state (state),
        INDEX idx_district (district)
      )
    `);
    
    // Create tourist_places table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tourist_places (
        id VARCHAR(36) PRIMARY KEY,
        city_id VARCHAR(36),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        category VARCHAR(100) DEFAULT 'attraction',
        avg_time_hours DECIMAL(3,1) DEFAULT 2,
        entry_fee_inr INT DEFAULT 0,
        best_time_to_visit VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
      )
    `);
    
    // Create trips table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        city_id VARCHAR(36),
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'planning',
        total_budget_inr INT DEFAULT 0,
        notes TEXT,
        is_public BOOLEAN DEFAULT false,
        share_code VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
      )
    `);
    
    // Create itinerary_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS itinerary_items (
        id VARCHAR(36) PRIMARY KEY,
        trip_id VARCHAR(36),
        tourist_place_id VARCHAR(36),
        day_number INT NOT NULL,
        start_time TIME,
        end_time TIME,
        activity_name VARCHAR(255) NOT NULL,
        activity_description TEXT,
        estimated_cost_inr INT DEFAULT 0,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
        FOREIGN KEY (tourist_place_id) REFERENCES tourist_places(id) ON DELETE SET NULL
      )
    `);
    
    // Create budget_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS budget_items (
        id VARCHAR(36) PRIMARY KEY,
        trip_id VARCHAR(36),
        category VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount_inr INT NOT NULL,
        is_estimated BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database initialized successfully');
  } finally {
    connection.release();
  }
}

module.exports = { pool, initializeDatabase };
