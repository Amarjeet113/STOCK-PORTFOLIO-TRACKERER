import axios from 'axios';

// Set your backend URL
const API_URL = 'https://stock-portfolio-trackerer.vercel.app/api/auth'; // Replace with actual backend URL if deployed

// Login function
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    localStorage.setItem('token', response.data.token);  // Save the JWT token
    return response.data;  // Return token data
  } catch (error) {
    console.error('Error during login:', error);
    throw error;  // Rethrow the error for handling in components
  }
};

// Signup function
const signup = async (user) => {
  try {
    await axios.post(`${API_URL}/signup`, user);
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;  // Rethrow the error for handling in components
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem('token'); // Remove token from local storage
};

export default { login, signup, logout };
