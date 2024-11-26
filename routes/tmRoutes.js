const express = require('express');
const { validateBoxWithAddress, addFullInfo, getFullInfoList, registerAddressWithPallet, addBoxToPallet } = require('../controllers/tmController');
const router = express.Router();

// POST запрос для проверки коробки
router.post('/validateBox', validateBoxWithAddress);
router.post('/addFullInfo', addFullInfo);
router.get('/getFullInfo', getFullInfoList)
router.post('/registerAddressWithPallet', registerAddressWithPallet);
router.post('/addBoxToPallet', addBoxToPallet);
module.exports = router;
