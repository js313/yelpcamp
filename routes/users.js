const express = require('express')
const router = express.Router()
const passport = require('passport')
const CatchAsync = require('../utils/CatchAsync')
const users = require('../controllers/users')

router.route('/register')
    .get(users.registerForm) //REGISTER FORM--------------------------------------------------------------------
    .post(CatchAsync(users.register))    //REGISTER-------------------------------------------------------------

router.route('/login')
    .get(users.loginForm)  //LOGIN FORM---------------------------------------------------------------
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), CatchAsync(users.login))//LOGIN

router.get('/logout', users.logout) //LOGOUT-----------------------------------------------------------------------------------

module.exports = router