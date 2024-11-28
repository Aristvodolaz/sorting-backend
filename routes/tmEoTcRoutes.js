const express = require('express');
const router = express.Router();
const tmEoTcController = require('../controllers/tmEoTcController');

// Добавление связи EO-Транспортное средство
router.post('/add', tmEoTcController.addEoToTransport);

// Получение всех записей
router.get('/list', tmEoTcController.getAllEoTransportLinks);

// Получение записей по EO
router.get('/eo/:eo', tmEoTcController.getEoTransportByEo);

// Получение записей по транспортному средству
router.get('/tc/:tc', tmEoTcController.getEoTransportByTc);

module.exports = router;
