const express = require('express');
const { validateBoxWithAddress, addFullInfo, getFullInfoList } = require('../controllers/tmController');
const router = express.Router();

// POST запрос для проверки коробки
router.post('/validateBox', validateBoxWithAddress);
router.post('/addFullInfo', addFullInfo);
router.get('/getFullInfo', getFullInfoList)

module.exports = router;
