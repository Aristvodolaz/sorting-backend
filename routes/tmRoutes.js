const express = require('express');
const { validateBoxWithAddress } = require('../controllers/tmController');
const router = express.Router();

// POST запрос для проверки коробки
router.post('/validateBox', validateBoxWithAddress);

module.exports = router;
