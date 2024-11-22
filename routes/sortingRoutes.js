const express = require('express');
const { getSortedData, completeSort } = require('../controllers/sortingController');
const router = express.Router();

// Получение данных сортировки
router.get('/sortedData', getSortedData);

// Завершение сортировки
router.post('/completeSort', completeSort);

module.exports = router;
