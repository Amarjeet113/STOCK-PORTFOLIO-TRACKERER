import axios from 'axios';

// Set your backend URL
const API_URL = 'http://localhost:5000/api/stocks'; // Replace with actual backend URL if deployed

// Fetch portfolio function
const getPortfolio = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;  // Rethrow the error for handling in components
  }
};

// Add a stock
const addStock = async (stock) => {
  try {
    const response = await axios.post(API_URL, stock, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error;  // Rethrow the error for handling in components
  }
};

// Delete a stock
const deleteStock = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;  // Rethrow the error for handling in components
  }
};

// Fetch real-time stock price
// Fetch real-time stock price from Alpha Vantage API
const getStockPrice = async (ticker) => {
  try {
    // Use Alpha Vantage API to fetch the stock's real-time price
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );

    // Check if the response is valid and contains the data
    const price = response.data["Global Quote"] && response.data["Global Quote"]["05. price"];

    if (!price) {
      throw new Error('Stock price data not available');
    }

    return parseFloat(price); // Return the price as a number
  } catch (error) {
    console.error('Error fetching stock price:', error);
    throw error; // Rethrow the error for handling in components
  }
};


export default { getPortfolio, addStock, deleteStock, getStockPrice };
