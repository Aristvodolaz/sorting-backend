const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Place = sequelize.define('Place', {
    sscc: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    d_task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Place;
