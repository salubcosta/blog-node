const express = require('express');
const slugify = require('slugify');
const Category = require('./Category');

const router = express.Router();

router.get('/admin/categories/new', (req, res)=>{
    res.render('admin/categories/new');
});

router.post('/categories/save',(req, res)=>{
    const title = req.body.title;

    if(title != undefined){

        Category.create({
            title: title,
            slug: slugify(title)
        })
        .then(()=>{
            console.log('created category!');
            res.redirect('/');
        })
        .catch(err=>console.log(`Oh my Good Lord! Something wrong happened! ${err}`));

    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', (req, res)=>{
    Category.findAll({raw: true})
    .then((cat)=>{
        res.render('admin/categories/index', { cat: cat});
    }).catch(err=>console.log(`Sorry about this. Error: ${err}`));
})

module.exports = router;