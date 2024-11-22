const { connectToDatabase, mssql } = require('./dbConfig');

async function executeQuery(query, params = {}) {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        // Привязываем параметры к запросу
        for (const [key, value] of Object.entries(params)) {
            request.input(key, value);
        }

        const result = await request.query(query);
        return result.recordset; // Возвращаем массив записей
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err);
        throw err;
    }
}

module.exports = {
    executeQuery,
};
