
const Stock = require('../models/Stock');
const axios = require('axios');

exports.getPortfolio = async (req, res) => {
  try {
    const stocks = await Stock.find({ userId: req.user.id });

    // Fetch live prices for stocks
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
          );

          // Check if response has the expected structure
          const globalQuote = response.data['Global Quote'];
          const currentPrice =
            globalQuote && globalQuote['05. price']
              ? parseFloat(globalQuote['05. price'])
              : stock.buyPrice; // Fallback to buyPrice if current price is unavailable

          return { ...stock._doc, currentPrice };
        } catch (apiErr) {
          console.error(`Error fetching data for ${stock.ticker}:`, apiErr.message);
          return { ...stock._doc, currentPrice: stock.buyPrice }; // Fallback to buyPrice
        }
      })
    );

    res.status(200).json(updatedStocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching portfolio', error: err.message });
  }
};


exports.addStock = async (req, res) => {
  const { name, ticker, quantity, buyPrice } = req.body;

  if (quantity <= 0 || buyPrice <= 0) {
    return res.status(400).json({ message: 'Quantity and Buy Price must be greater than 0' });
  }

  try {
    const stock = new Stock({ userId: req.user.id, name, ticker, quantity, buyPrice });
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    console.error('Error saving stock:', err);
    res.status(500).json({ message: 'Error adding stock', error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting stock' });
  }
};
