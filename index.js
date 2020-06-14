const express = require('express');
const bodyParser = require('body-parser');
const Connection = require('./database/database'); //Database connection
const categoriesController = require('./categories/CategoriesController');
const articleController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');



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
    res.render('index', {value});
})

app.listen(3000, ()=>{
    console.log('Server running');
});