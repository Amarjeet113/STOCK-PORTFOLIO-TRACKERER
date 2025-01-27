const express = require('express');
const { getPortfolio, addStock, deleteStock } = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getPortfolio);
router.post('/', authMiddleware, addStock);
router.delete('/:id', authMiddleware, deleteStock);

module.exports = router;
