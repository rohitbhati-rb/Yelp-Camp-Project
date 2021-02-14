const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}))
router.get('/login', (req,res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}) , (req,res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success', 'Logout Successful, Bye!');
    res.redirect('/campgrounds');
})

module.exports = router;