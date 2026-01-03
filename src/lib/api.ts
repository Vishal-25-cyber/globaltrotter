const API_URL = 'http://localhost:3001/api';

let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

export const api = {
  // Auth
  async signup(email: string, password: string, full_name?: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name })
    });
    if (!response.ok) throw new Error(await response.text());
    const user = await response.json();
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    return { user, error: null };
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error(await response.text());
    const user = await response.json();
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    return { user, error: null };
  },

  async signOut() {
    currentUser = null;
    localStorage.removeItem('user');
    return { error: null };
  },

  getCurrentUser() {
    return currentUser;
  },

  // Cities
  async getCities() {
    const response = await fetch(`${API_URL}/cities`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  async getCity(id: string) {
    const response = await fetch(`${API_URL}/cities/${id}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  // Tourist Places
  async getTouristPlaces(city_id: string) {
    const response = await fetch(`${API_URL}/tourist-places?city_id=${city_id}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  // Trips
  async getTrips(user_id: string) {
    const response = await fetch(`${API_URL}/trips?user_id=${user_id}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  async getTrip(id: string) {
    const response = await fetch(`${API_URL}/trips/${id}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  async createTrip(trip: any) {
    const response = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip)
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  async updateTrip(id: string, updates: any) {
    const response = await fetch(`${API_URL}/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  async deleteTrip(id: string) {
    const response = await fetch(`${API_URL}/trips/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(await response.text());
    return { error: null };
  },

  // Itinerary Items
  async getItineraryItems(trip_id: string) {
    const response = await fetch(`${API_URL}/itinerary-items?trip_id=${trip_id}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  async createItineraryItems(items: any[]) {
    const response = await fetch(`${API_URL}/itinerary-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  // Budget Items
  async getBudgetItems(trip_id: string) {
    const response = await fetch(`${API_URL}/budget-items?trip_id=${trip_id}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  },

  async createBudgetItems(items: any[]) {
    const response = await fetch(`${API_URL}/budget-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return { data, error: null };
  }
};
