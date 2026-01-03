const API_URL = 'http://localhost:3001/api';

let currentUser: any = null;

// Initialize currentUser from localStorage safely
if (typeof window !== 'undefined') {
  try {
    currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    currentUser = null;
  }
}

export const api = {
  // Auth
  async signup(email: string, password: string, full_name?: string) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Sign up failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        return { user: null, error: { message: errorMessage } };
      }
      
      const user = await response.json();
      // Don't save user to localStorage or set currentUser on signup
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: { message: error.message || 'Network error occurred' } };
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Login failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        return { user: null, error: { message: errorMessage } };
      }
      
      const user = await response.json();
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: { message: error.message || 'Network error occurred' } };
    }
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
    try {
      const response = await fetch(`${API_URL}/cities`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: [], error: { message: error.message || 'Failed to fetch cities' } };
    }
  },

  async getCity(id: string) {
    try {
      const response = await fetch(`${API_URL}/cities/${id}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Failed to fetch city' } };
    }
  },
  async getSharedTrip(shareCode: string) {
    const response = await fetch(`${API_URL}/trips/shared/${shareCode}`);
    if (!response.ok) {
      if (response.status === 404) {
        return { data: null, error: { message: 'Trip not found or not public' } };
      }
      throw new Error(await response.text());
    }
    const data = await response.json();
    return { data, error: null };
  },
  // Tourist Places
  async getTouristPlaces(city_id: string) {
    try {
      const response = await fetch(`${API_URL}/tourist-places?city_id=${city_id}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: [], error: { message: error.message || 'Failed to fetch places' } };
    }
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
