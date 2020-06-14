const Sequelize = require('sequelize');

const Connection =  new Sequelize('blogdb', 'salumao', '123456', {
    host: 'localhost',
    dialect: 'mariadb'
});

module.exports = Connection;