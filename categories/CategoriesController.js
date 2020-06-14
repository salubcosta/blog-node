const express = require('express');
const router = express.Router();

router.get('/categories', (req, res)=>{
    res.render('index');
});

module.exports = router;