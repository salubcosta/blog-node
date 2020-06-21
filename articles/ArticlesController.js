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

router.get('/admin/article/edit/:id', (req, res)=>{
    const id = req.params.id;
    if(!isNaN(id)){
        Article.findByPk(id)
        .then(article=>{
            Category.findByPk(article.categoryId)
            .then(category=>{
                const categorySelected = {id: category.id, title: category.title}
                Category.findAll().then(categories=>{
                    const categoryfilter = categories.filter(item => item.id != categorySelected.id)
                    res.render('admin/articles/edit', {article: article, categories: categoryfilter, categorySelected: categorySelected});
                })
            })
        })
        Category.findAll().then(category=>{
            
        })
    }else{
        res.redirect('/admin/articles');
    }
});

router.post('/article/edit', (req, res)=>{
    const id = req.body.id;
    const title = req.body.title;
    const description = req.body.description;
    const body = String(req.body.body);
    const categoryId = req.body.category;
    
    if(isNaN(categoryId) || isNaN(id)){
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

    Article.update({
        title: title,
        description: description,
        slug: Slugify(title),
        body: body,
        categoryId: categoryId
    }, { where: {id: id}})
    .then(()=>res.redirect('/admin/articles'))
})

module.exports = router;