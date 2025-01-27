import React, { useState } from 'react';
import stockService from '../Services/stockService';
import { useNavigate } from 'react-router-dom';
import './Stockform.css';

const StockForm = ({ setPortfolio }) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState(1); // Default to 1
  const [buyPrice, setBuyPrice] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newStock = { name, ticker, quantity, buyPrice };
    
    try {
      if (!name || !ticker || !quantity || !buyPrice) {
        setError('Please provide all the details.');
        return;
      }
      setLoading(true); // Set loading to true when form submission starts
      await stockService.addStock(newStock);
      setLoading(false); // Set loading to false after adding stock
      navigate('/dashboard');
      navigate(0); // Redirect back to Dashboard
    } catch (error) {
      setLoading(false); // Set loading to false in case of error
      setError('Error adding stock. Please try again.');
      console.error('Error adding stock:', error);
    }
  };

  return (
    <div className="stock-form">
      <h2>Add New Stock</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Stock Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Buy Price</label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Add Stock</button>
      </form>
      {loading && (
        <div className="loading-spinner">
          <div className="loading-cube">
            <div className="front"></div>
            <div className="back"></div>
            <div className="left"></div>
            <div className="right"></div>
            <div className="top"></div>
            <div className="bottom"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockForm; 