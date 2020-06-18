const Sequelize = require('sequelize');
const Conn = require('../database/database');
const Category = require('../categories/Category');

const Article = Conn.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // Relacionamento 1..*  - Cada categoria possui nenhum ou muitos artigos
Article.belongsTo(Category); //Relacionamento 1..1 - Cada artigo possui apenas uma categoria

Article.sync({force: false});

module.exports = Article;