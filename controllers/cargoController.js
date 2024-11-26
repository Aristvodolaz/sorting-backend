const { executeQuery } = require('../config/database');

// Контроллер для обработки запроса
exports.handleCargoLogic = async (req, res) => {
    const { sscc } = req.query;

    if (!sscc) {
        return res.status(200).json({
            success: false,
            message: 'Параметр sscc обязателен',
        });
    }

    try {
        // Шаг 1: Получить CARGO_UNIT_ID из lcb.cargo_unit
        const cargoUnitQuery = `
            SELECT * 
            FROM OPENQUERY(OW, 'SELECT ID FROM lcb.cargo_unit WHERE SSCC = ''${sscc}''')
        `;
        const cargoUnitResult = await executeQuery(cargoUnitQuery);

        if (cargoUnitResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'CARGO_UNIT_ID не найден',
            });
        }

        const cargoUnitId = cargoUnitResult[0].ID;

        // Шаг 2: Получить записи из lcb.cargo_spec
        const cargoSpecQuery = `
            SELECT * 
            FROM OPENQUERY(OW, 'SELECT CARGO_ID FROM lcb.cargo_spec WHERE CARGO_UNIT_ID = ''${cargoUnitId}''')
        `;
        const cargoSpecResult = await executeQuery(cargoSpecQuery);

        if (cargoSpecResult.length > 1) {
            return res.status(200).json({
                success: false,
                message: 'Отсканируйте коробку',
            });
        } else if (cargoSpecResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'CARGO_SPEC не найден',
            });
        }

        const cargoId = cargoSpecResult[0].CARGO_ID;

        // Шаг 3: Получить данные по CARGO_ID
        const finalQuery = `
            SELECT 
                v.rsd_code, 
                tr.rsd_every_day_num
            FROM OPENQUERY(OW, 
                'SELECT 
                    v.rsd_code, 
                    tr.rsd_every_day_num
                FROM lcb.cargo_spec s
                LEFT JOIN lcb.cargo c ON c.id = s.cargo_id
                LEFT JOIN elite.ship$ sh ON sh.ship_id = c.doc_no
                LEFT JOIN elite.v_reestr_ord_k1$ v ON v.reestr_id = sh.deliv_id
                JOIN elite.v_transport_order$ tr ON tr.to_id = v.to_id
                WHERE c.id = ''${cargoId}''')
        `;
        const finalResult = await executeQuery(finalQuery);

        if (finalResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Данные не найдены для указанного CARGO_ID',
            });
        }

        // Успешный результат
        res.status(200).json({
            success: true,
            data: finalResult[0],
        });
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err);
        res.status(200).json({
            success: false,
            message: 'Ошибка сервера',
            error: err.message,
        });
    }
};


