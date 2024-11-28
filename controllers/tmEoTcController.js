const { executeQuery } = require('../config/database');

// Добавление связи EO-Транспортное средство
exports.addEoToTransport = async (req, res) => {
    const { eo, tc } = req.body;

    if (!eo || !tc) {
        return res.status(400).json({ message: 'Параметры eo и tc обязательны.' });
    }

    const query = `
        INSERT INTO TM_eo_tc (eo, tc)
        VALUES (@eo, @tc);
        SELECT SCOPE_IDENTITY() AS id; -- Получаем ID последней вставленной записи
    `;

    try {
        const result = await executeQuery(query, { eo, tc });
        const insertedId = result[0]?.id;

        res.status(200).json({
            success: true,
            message: 'Связь EO и ТС успешно добавлена.',
            id: insertedId,
        });
    } catch (err) {
        console.error('Ошибка добавления связи EO и ТС:', err);
        res.status(500).json({ success: false, message: 'Ошибка сервера', error: err.message });
    }
};

// Получение всех записей из TM_eo_tc
exports.getAllEoTransportLinks = async (req, res) => {
    const query = `
        SELECT *
        FROM TM_eo_tc
        ORDER BY created_at DESC;
    `;

    try {
        const data = await executeQuery(query);
        res.status(200).json({
            success: true,
            message: 'Список записей успешно получен.',
            data,
        });
    } catch (err) {
        console.error('Ошибка получения списка EO-ТС:', err);
        res.status(500).json({ success: false, message: 'Ошибка сервера', error: err.message });
    }
};

// Получение записей по EO
exports.getEoTransportByEo = async (req, res) => {
    const { eo } = req.params;

    if (!eo) {
        return res.status(400).json({ message: 'Параметр eo обязателен.' });
    }

    const query = `
        SELECT *
        FROM TM_eo_tc
        WHERE eo = @eo;
    `;

    try {
        const data = await executeQuery(query, { eo });
        if (data.length === 0) {
            return res.status(404).json({ message: `Записи для EO ${eo} не найдены.` });
        }

        res.status(200).json({
            success: true,
            message: `Записи для EO ${eo} успешно получены.`,
            data,
        });
    } catch (err) {
        console.error('Ошибка получения записей для EO:', err);
        res.status(500).json({ success: false, message: 'Ошибка сервера', error: err.message });
    }
};

// Получение записей по транспортному средству
exports.getEoTransportByTc = async (req, res) => {
    const { tc } = req.params;

    if (!tc) {
        return res.status(400).json({ message: 'Параметр tc обязателен.' });
    }

    const query = `
        SELECT *
        FROM TM_eo_tc
        WHERE tc = @tc;
    `;

    try {
        const data = await executeQuery(query, { tc });
        if (data.length === 0) {
            return res.status(404).json({ message: `Записи для ТС ${tc} не найдены.` });
        }

        res.status(200).json({
            success: true,
            message: `Записи для ТС ${tc} успешно получены.`,
            data,
        });
    } catch (err) {
        console.error('Ошибка получения записей для ТС:', err);
        res.status(500).json({ success: false, message: 'Ошибка сервера', error: err.message });
    }
};
