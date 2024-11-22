const express = require('express');
const { validateBoxWithAddress, addFullInfo } = require('../controllers/tmController');
const router = express.Router();

// POST запрос для проверки коробки
router.post('/validateBox', validateBoxWithAddress);
router.post('/addFullInfo', addFullInfo);

module.exports = router;
