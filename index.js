const express = require('express');
const bodyParser = require('body-parser');
const Connection = require('./database/database'); //Database connection
const categoriesController = require('./categories/CategoriesController');
const articleController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

const moment = require('moment');

const app = express();

// Authentication on dabatase
Connection.authenticate().then(()=>console.log('Authenticated')).catch(err=>console.log(`Bad news. Error: ${err}`));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Working with routes
app.use('/', categoriesController);
app.use('/', articleController);


app.get('/', (req, res)=>{
    Article.findAll({
        include: [{model: Category}],
        order: [['id', 'desc']],
        limit: 4
    }).then((articles)=>{
        Category.findAll().then((categories)=>{
            res.render('index', {articles: articles, moment: moment, categories: categories});
        })
    });
    // res.send('teste');
})

app.get('/:slug', (req, res)=>{
    const slug = req.params.slug;
    Article.findOne({
        where:{slug: slug},
        include: [{model: Category}]
    })
    .then((article)=>{
        if(article != undefined){
            Category.findAll().then((categories)=>{
                res.render('article', {article: article, moment: moment, categories: categories});
            }).catch((err)=>console.log(`Problem with load categories. Error: ${err}`));
        } else {
            res.redirect('/');
        }
    })
});

app.get('/categories/:slug', (req, res)=>{
    const slug = req.params.slug;
    if(slug != undefined){
        Category.findOne({
            where: {slug: slug}
        }).then((category)=>{
            if(category != undefined){
                Article.findAll({
                    where: { categoryId: category.id},
                    include: [{model: Category}],
                    order: [['id', 'desc']]
                }).then((articles)=>{
                    Category.findAll().then((categories)=>{
                        res.render('categories', {articles: articles, moment: moment, categories: categories}); 
                    })
                });
            }else{
                res.redirect('/');
            }
        })
    } else {
        res.redirect('/');
    }
});

app.get('/page/:num', (req, res)=>{
    var page = req.params.num;
    var offset = 0;
    var limit = 4;

    if(isNaN(page) || page == 1){
        offset = 0
    } else {
        offset = (Number(page)-1)*limit;
    }
    
    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [{model: Category}]   
    }).then(articles =>{
        var next = false;
        if(offset+limit >= articles.count){
            next = false
        } else {
            next = true;
        }
        result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then((categories)=>{
            res.render('page', {result: result, moment: moment, categories: categories});
        })
    })
});
app.listen(3000, ()=>{
    console.log('Server running');
});