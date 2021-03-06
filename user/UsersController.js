const express = require('express');
const router = express.Router();
const User = require('./User');
const bcryptjs = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req, res)=>{
    User.findAll().then(users=>{
        res.render('admin/users/index', {users: users});
    }).catch(err=>console.log(err));
});

router.get('/admin/user/new', adminAuth, (req, res)=>{
    res.render('admin/users/new');
});

router.post('/user/save', adminAuth, (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(name == undefined || email == undefined || password == undefined || password == ''){
        res.redirect('admin/users');
        return;
    }

    User.findOne({where: {email: email}}).then(user=>{
        if(user == undefined){
            const salt = bcryptjs.genSaltSync(10);
            const hash = bcryptjs.hashSync(password, salt);

            User.create({
                name: name,
                email: email,
                password: hash
            }).then(()=>{
                res.redirect('/admin/users');
            }).catch(err=>console.log(err));
        } else {
            res.redirect('/admin/user/new');
        }
    });
});

router.get('/admin/login', (req, res)=>{
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({where: {email: email}}).then((user)=>{
        if(user != undefined){
            const isValid = bcryptjs.compareSync(password, user.password);
            if(isValid){    
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
                res.redirect('/admin/articles');
            } else {
                res.redirect('/admin/login');
            }
        } else {
            res.redirect('/admin/login');
        }
    })
});

router.get('/admin/logout', (req, res)=>{
    req.session.user = undefined;
    res.redirect('/');
});

router.get('/admin/user/edit/:id', (req, res)=>{
    const id = req.params.id;
    if(!isNaN(id)){
        User.findByPk(id).then(user=>{
            if(user != undefined){
                res.render('admin/users/edit', {user: user});
            } else {
                res.redirect('/admin/users');
            }
        }).catch(err=>console.log(err));
    } else {
        res.redirect('/admin/users');
    }
});

router.post('/user/edit', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    
    if(name == undefined || email == undefined || password == undefined || password == ''){
        res.redirect('admin/users');
        return;
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    User.update({
        name: name,
        email: email,
        password: hash
    }, {where: {id:id}}).then(()=>res.redirect('/admin/users')).catch((err)=>console.log(err));
});

module.exports = router;