const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Truck = sequelize.define('Truck', {
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Truck;
