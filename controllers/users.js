const User = require('../models/user')

module.exports.registerForm = (req, res) => { //REGISTER FORM--------------------------------------------------------------------
    res.render('users/register')
}

module.exports.register = async (req, res, next) => { //REGISTER-----------------------------------------------------------------
    try {
        const { email, username, password } = req.body
        const user = new User({
            email,
            username,
            password
        })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {  //does not return a promise so we have to use callback
            if(err) return next(err)
        })
        req.flash('success', 'Welcome to YELP CAMP!')
        res.redirect('/campgrounds')
    }catch(err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}

module.exports.loginForm = (req, res) => {    //LOGIN FORM--------------------------------------------------------------------------
    res.render('users/login')
}

module.exports.login = async (req, res) => {   //LOGIN------------------------------------------------------------------------------
    req.flash('success', 'Welcome Back!')
    const redirectPath = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectPath)
}

module.exports.logout = (req, res) => {   //LOGOUT----------------------------------------------------------------------------------
    req.logout()
    res.redirect('/campgrounds')
}