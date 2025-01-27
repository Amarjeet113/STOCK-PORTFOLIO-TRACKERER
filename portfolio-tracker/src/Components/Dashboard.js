import React, { useState, useEffect } from 'react';
import stockService from '../Services/stockService';
import StockList from './StockList';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0); // State to store the total value of the portfolio

  // Fetch portfolio data on initial load
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await stockService.getPortfolio();
        setPortfolio(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };

    fetchPortfolio();
  }, []);

  // Function to calculate total portfolio value
  const calculateTotalPortfolioValue = async () => {
    let total = 0;
  
    for (const stock of portfolio) {
      const { ticker, quantity } = stock;
      
      try {
        const stockPrice = await stockService.getStockPrice(ticker);
        console.log("stockPrice", stockPrice);
        
        total += stockPrice * quantity;
      } catch (error) {
        console.error(`Error calculating value for ${ticker}:`, error);
      }
    }
  
    setTotalValue(total);
  };
  

  // Recalculate total portfolio value whenever portfolio changes
  useEffect(() => {
    if (portfolio.length > 0) {
      calculateTotalPortfolioValue();
    }
  }, [portfolio]);

  return (
    <div className="dashboard">
      <h1>Your Portfolio</h1>
      {portfolio.length > 0 ? (
        <>
          <StockList portfolio={portfolio} />
          {/* Display total portfolio value */}
          <div className="total-value">
            <h3>Total Portfolio Value: ${totalValue.toFixed(2)}</h3>
          </div>
        </>
      ) : (
        <p>Your portfolio is empty. Add stocks to get started.</p>
      )}
      <Link to="/add-stock">
        <button>Add Stock</button>
      </Link>
    </div>
  );
};

export default Dashboard;
