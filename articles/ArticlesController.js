const express = require('express');
const router = express.Router();

router.get('/articles',(req, res)=>{
    res.render('index');
});

module.exports = router;