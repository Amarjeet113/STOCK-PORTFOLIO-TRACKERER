import React, { useEffect, useState } from 'react';
import stockService from '../Services/stockService';
import { useNavigate } from 'react-router-dom';
import './stocklist.css';

const StockList = ({ portfolio, setPortfolio }) => {
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true); // Start loading
      try {
        const data = await stockService.getPortfolio();
        // setPortfolio(data); // Set portfolio data
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPortfolio();
  }, [setPortfolio]);

  const stockdelete = async (stockId) => {
    setLoading(true); // Start loading for delete operation
    try {
      await stockService.deleteStock(stockId); // Call the API to delete the stock
     
      alert('Stock deleted successfully');
      navigate(0);
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert('Failed to delete the stock. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="stock-list">
      <h2>Your Stocks</h2>
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
      <ul>
        {!loading && portfolio.length === 0 ? (
          <li>No stocks in your portfolio.</li>
        ) : (
          portfolio.map((stock) => (
            <li key={stock._id}>
              <span>{stock.name} ({stock.ticker})</span>
              <span>Quantity: {stock.quantity}</span>
              <span>Buy Price: ${stock.buyPrice}</span>
              <button onClick={() => stockdelete(stock._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StockList;
