const Sequelize = require('sequelize');
const Conn = require('../database/database');

const User = Conn.define('users',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.sync({force: false})

module.exports = User;