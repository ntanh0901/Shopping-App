const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
});

router.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Signup'
    })
})

module.exports = router;