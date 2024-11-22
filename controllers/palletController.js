const { executeQuery } = require('../config/database');

// Получение данных по SSCC
exports.getSortedData = async (req, res) => {
    const { sscc } = req.query; // Получаем SSCC из строки запроса

    // Проверка наличия SSCC
    if (!sscc) {
        return res.status(400).json({ message: 'Параметр sscc обязателен' });
    }

    const query = `SELECT *
FROM OPENQUERY(OW,
        'SELECT v.rsd_code, tr.rsd_every_day_num
        FROM wms.d_place p
        LEFT JOIN wms.d_task t ON t.id = p.d_task_id
        LEFT JOIN wms.d_task z ON z.id = t.parent_id
        LEFT JOIN lcb.cargo c ON c.id = z.cargo_id
        LEFT JOIN elite.v_reestr_ord_k1$ v ON v.reestr_id = c.elite_id
        LEFT JOIN elite.v_transport_order$ tr ON tr.to_id = v.to_id
        WHERE p.sscc = ''${sscc}''')`;

    try {
        const data = await executeQuery(query, { sscc });

        if (data.length === 0) {
            return res.status(404).json({ message: 'Данные не найдены для указанного SSCC' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err);
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};