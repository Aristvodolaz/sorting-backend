const express = require('express');
const bodyParser = require('body-parser');
const sortingRoutes = require('./routes/sortingRoutes');
const tmRoutes = require('./routes/tmRoutes');

const app = express();

// Middlewares
app.use(bodyParser.json());

// Подключение маршрутов
app.use('/api', sortingRoutes);
app.use('/api/tm', tmRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
