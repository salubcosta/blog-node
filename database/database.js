const Sequelize = require('sequelize');

const Connection =  new Sequelize('blogdb', 'salumao', '123456', {
    host: 'localhost',
    dialect: 'mariadb',
    timezone: '-03:00'
});

module.exports = Connection;