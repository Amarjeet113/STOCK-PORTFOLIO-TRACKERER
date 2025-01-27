const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import route modules
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');

// Initialize Express app
const app = express();

// Middleware
const allowedOrigins = [
  'https://stock-portfolio-trackerer-fdh6.vercel.app', // Your frontend URL
  'https://stock-portfolio-trackerer.vercel.app',  
  'http://localhost:3000/'
  //    // If your backend and frontend are on different subdomains or environments
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


// Use CORS middleware
app.use(cors(corsOptions));// Enable CORS
app.use(express.json()); // Parse JSON request body

// MongoDB Connection
const mongoUri = process.env.MONGO_URI.replace('<amar113>', encodeURIComponent('amar113'));

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // Exit process with failure
  });

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/stocks', stockRoutes); // Stock-related routes

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to the Portfolio Tracker API!', 
    alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('⚠️ An error occurred:', err.message);
  res.status(500).json({ error: 'An internal server error occurred' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
