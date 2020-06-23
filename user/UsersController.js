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
module.exports = router;