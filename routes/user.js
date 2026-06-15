const express = require('express');
const router = express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const user=require('../controllers/user.js')

//Sign up form
router.route('/signup')
.get(user.rednerSignupForm)
.post(wrapAsync(user.signup))

router.route('/login')
.get(user.renderLoginForm)
.post(
    saveRedirectUrl, 
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),
    user.login
)

router.get('/logout',user.logout);

module.exports=router;