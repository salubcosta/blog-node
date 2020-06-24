const express = require('express');
const router = express.Router();
const User = require('./User');
const bcryptjs = require('bcryptjs');

router.get('/admin/users', (req, res)=>{
    User.findAll().then(users=>{
        res.render('admin/users/index', {users: users});
    }).catch(err=>console.log(err));
});

router.get('/admin/user/new', (req, res)=>{
    res.render('admin/users/new');
});

router.post('/user/save', (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(name == undefined || email == undefined || password == undefined){
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

module.exports = router;