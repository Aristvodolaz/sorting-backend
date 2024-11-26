const express = require('express');
const { handleCargoLogic } = require('../controllers/cargoController');
const router = express.Router();

// Маршрут для обработки логики по SSCC
router.get('/handleCargo', handleCargoLogic);

module.exports = router;
