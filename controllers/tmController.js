const { executeQuery } = require('../config/database');

exports.validateBoxWithAddress = async (req, res) => {
    const { sscc, pallet_scanned } = req.body;

    if (!sscc || !pallet_scanned) {
        return res.status(400).json({ message: 'Параметры sscc и pallet_scanned обязательны' });
    }

    const query = `
        SELECT *
        FROM OPENQUERY(OW,
            'SELECT v.rsd_code, tr.rsd_every_day_num
            FROM wms.d_place p
            LEFT JOIN wms.d_task t ON t.id = p.d_task_id
            LEFT JOIN wms.d_task z ON z.id = t.parent_id
            LEFT JOIN lcb.cargo c ON c.id = z.cargo_id
            LEFT JOIN elite.v_reestr_ord_k1$ v ON v.reestr_id = c.elite_id
            LEFT JOIN elite.v_transport_order$ tr ON tr.to_id = v.to_id
            WHERE p.sscc = ''${sscc}''')
    `;

    try {
        const data = await executeQuery(query);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Данные не найдены для указанного SSCC' });
        }

        const { RSD_CODE, RSD_EVERY_DAY_NUM } = data[0];

        const addressParts = pallet_scanned.split('-');
        if (addressParts.length !== 2 || isNaN(addressParts[1])) {
            return res.status(400).json({ message: 'Неверный формат адреса (ожидается формат BL-7)' });
        }

        const palletRsdCode = addressParts[0];
        const palletZn = parseInt(addressParts[1], 10);

        if (palletRsdCode === RSD_CODE && palletZn === RSD_EVERY_DAY_NUM) {
            return res.status(200).json({ message: 'Коробка подходит к адресу', valid: true });
        } else {
            return res.status(400).json({
                message: 'Коробка не подходит к адресу',
                valid: false,
                expected: { RSD_CODE, RSD_EVERY_DAY_NUM },
                provided: { palletRsdCode, palletZn },
            });
        }
    } catch (err) {
        console.error('Ошибка проверки коробки:', err);
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};

// Добавление данных в TM_full_info
exports.addFullInfo = async (req, res) => {
    const { eo, order_name, zayavka, sn, address, client } = req.body;

    if (!eo || !order_name || !zayavka || !sn || !address || !client) {
        return res.status(400).json({ message: 'Все поля, кроме mesto, обязательны' });
    }

    const query = `
        INSERT INTO TM_full_info (eo, order_name, zayavka, sn, address, client, mesto)
        VALUES (@eo, @order_name, @zayavka, @sn, @address, @client, @mesto);
        SELECT SCOPE_IDENTITY() AS id; -- Получаем ID последней вставленной записи
    `;

    try {
        const result = await executeQuery(query, {
            eo,
            order_name,
            zayavka,
            sn,
            address,
            client,
            mesto: 1, // Значение поля mesto всегда равно 1
        });

        const insertedId = result[0]?.id;

        res.status(200).json({
            message: 'Данные успешно добавлены',
            id: insertedId,
        });
    } catch (err) {
        console.error('Ошибка добавления данных:', err);
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};

// Получение списка данных из TM_full_info
exports.getFullInfoList = async (req, res) => {
    const query = `
        SELECT *
        FROM TM_full_info
        ORDER BY ID DESC;
    `;

    try {
        const data = await executeQuery(query);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Список пуст' });
        }

        res.status(200).json({
            message: 'Список успешно получен',
            data,
        });
    } catch (err) {
        console.error('Ошибка получения списка:', err);
        res.status(500).json({ message: 'Ошибка сервера', error: err.message });
    }
};