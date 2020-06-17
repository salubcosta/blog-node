const express = require('express');
const slugify = require('slugify');
const Category = require('./Category');

const router = express.Router();

/** 
 * Route view {new} with form
 */
router.get('/admin/categories/new', (req, res)=>{
    res.render('admin/categories/new');
});

/**
 * Save data on database
 */
router.post('/categories/save',(req, res)=>{
    const title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        })
        .then(()=>{
            console.log('created category!');
            res.redirect('/admin/categories');
        })
        .catch(err=>console.log(`Oh my Good Lord! Something wrong happened! ${err}`));
    } else {
        res.redirect('/admin/categories/new');
    }
});

/**
 * Load data from the database
 */
router.get('/admin/categories', (req, res)=>{
    Category.findAll({raw: true})
    .then((cat)=>{
        res.render('admin/categories/index', { cat: cat});
    }).catch(err=>console.log(`Sorry about this. Error: ${err}`));
})

/**
 * Delete data
 */
router.post('/categories/delete', (req, res)=>{
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({where: {id: id}})
            .then(()=>res.redirect('/admin/categories')) //Go categories index
            .catch(err=>console.log(`Something wrong happened to delete. Error: ${err}`));
        } else {
            console.log('Id isNaN!');
            res.redirect('/admin/categories');
        }
    } else{
        console.log('Id is null/undefined!');
        res.redirect('/admin/categories');
    }
});

/**
 * Load view {Edit}
 */
router.get('/admin/categories/edit/:id', (req, res)=>{
    const id = Number(req.params.id);

    if(isNaN(id)){
        res.redirect('/admin/categories');
    }

    Category.findByPk(id)
    .then(category=>{
        res.render('admin/categories/edit', {category: category});
    }).catch(err=>console.log(err));
});

/**
 * Update category
 */
router.post('/categories/edit', (req, res)=>{
    const id = req.body.id;
    const title = req.body.title;

    Category.update({title: title, slug: slugify(title)},{where: {id: id}})
    .then(()=>res.redirect('/admin/categories'));
});

module.exports = router;