const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./docs/swagger.yaml'); // Укажите путь к вашему Swagger-файлу


const sortingRoutes = require('./routes/sortingRoutes');
const tmRoutes = require('./routes/tmRoutes');
const cargoRoutes = require('./routes/cargoRoutes');
const eoTcRoutes = require('./routes/tmEoTcRoutes');

const app = express();

// Middlewares
app.use(bodyParser.json());

// Подключение маршрутов
app.use('/api', sortingRoutes);
app.use('/api/tm', tmRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('api/eoTc/', eoTcRoutes)


// Запуск сервера
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
