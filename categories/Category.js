const Sequelize = require('sequelize');
const Conn = require('../database/database');

const Category = Conn.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Category.sync({force: false});

module.exports = Category;