const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const Slugify = require('slugify');

router.get('/admin/articles', (req, res)=>{
    res.render('admin/articles');
})

router.get('/admin/articles/new',(req, res)=>{
    Category.findAll({raw: true})
    .then((category)=>{
        console.log(category);
        res.render('admin/articles/new', {category: category})
    });
});

router.post('/articles/save', (req, res)=>{
    const title = req.body.title;
    const body = String(req.body.body);
    const category = req.body.category;
    
    if(isNaN(category)){
        res.redirect('/');
        return;
    }
    if(String(title).length < 10){
        res.redirect('/');
        return;
    } 
    if(body.length < 200){
        res.redirect('/');
        return;
    }
    
    Article.create({
        title: title,
        slug: Slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles');
    });
})

module.exports = router;