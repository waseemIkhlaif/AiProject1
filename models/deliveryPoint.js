const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeliveryPoint = sequelize.define('DeliveryPoint', {
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    demand: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    x: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    y: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = DeliveryPoint;
