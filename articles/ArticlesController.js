const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const Slugify = require('slugify');

router.get('/admin/articles', (req, res)=>{
    Article.findAll({include: [{model: Category}]}).then((articles)=>{
        res.render('admin/articles', {articles: articles});
    });
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
    const description = req.body.description;
    
    if(isNaN(category)){
        res.redirect('/admin/articles');
        return;
    }
    if(String(title).length < 10 || String(description).length < 10){
        res.redirect('/admin/articles');
        return;
    } 
    if(body.length < 200){
        res.redirect('/admin/articles');
        return;
    }
    
    Article.create({
        title: title,
        description: description,
        slug: Slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles');
    });
})

router.post('/article/delete', (req, res)=>{
    const data = JSON.parse(req.body.id);
    if(data.id != undefined){
        if(!isNaN(data.id)){
            Article.destroy({where: {id: data.id}}).then(()=>{
                res.redirect('/admin/articles');
            });
        } else {
            res.redirect('/admin/articles');    
        }
    } else {
        res.redirect('/admin/articles');
    }
});

module.exports = router;