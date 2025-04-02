// src/services/authService.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/auth';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Interceptor found token:', token ? 'yes' : 'no');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Setting Authorization header with token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const authService = {
  // Register new user
  register: async (username, email, password) => {
    try {
      const response = await api.post('/register', { username, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User stored after registration:', response.data.user); // Add this
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      console.log(`Sending login request to ${API_URL}/login`);
      
      const response = await api.post('/login', { email, password });
      console.log("Login response:", response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log("Token stored in localStorage:", localStorage.getItem('token'));
        console.log("User stored after login:", response.data.user);
        return response.data;
      } else {
        console.warn("Response didn't contain a token:", response.data);
        throw { message: "Invalid login response from server" };
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Check if it's an Axios error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error:", error.response.status, error.response.data);
        
        if (error.response.status === 401) {
          throw { message: "Invalid email or password", status: 401 };
        } else if (error.response.status === 404) {
          throw { message: "Login service not found. Check API URL configuration.", status: 404 };
        } else {
          throw error.response.data || { message: `Server error (${error.response.status})`, status: error.response.status };
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw { message: "Server not responding. Please check your connection and try again." };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        throw { message: error.message || "Unknown error occurred" };
      }
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Deactivate account
  deactivateAccount: async () => {
    try {
      const response = await api.post('/deactivate');
      authService.logout();
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  }
};

export default authService;