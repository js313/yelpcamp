if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()  //This library loads variables from .env file to process.env variable in node.js
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const Joi = require('joi')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const ExpressError = require('./utils/ExpressError')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => (console.log("MongoDB Connected")))
.catch(err => (console.log(err)))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)
mongoose.set('useFindAndModify', false);    //To remove the deprecation warning
mongoose.set('useCreateIndex', true);

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('__method'))
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
    name: 'session',    //to change the default name of connect.sid, to prevent people from knowing what to attack
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        HttpOnly: true, //is not accessible through javascript
        secure: true    //cookie only works on https, breaks thing when in development
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session()) //session middleware(app.use(session(sessionConfig))) should be used before passport.session
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {   //should be defined before route handlers
    res.locals.currentUser = req.user   //this middleware should be after passport middlewares to be able to use req.user
    res.locals.success = req.flash('success')    //Passes the value under success key sent by any request handler to success variable
    res.locals.error = req.flash('error')
    next()
})

app.use(mongoSanitize())
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dka6w0h3v/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://www.revv.co.in",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
)

app.use('/campgrounds', campgroundRoutes)           //Route Handlers
app.use('/campgrounds/:cid/reviews', reviewRoutes)  //Route Handlers
app.use('', userRoutes)                             //Route Handlers

app.get('/', (req, res) => {    //HOME PAGE----------------------------------------------------------------------------------------------
    res.render('home.ejs')
})

app.all('*', (req, res, next) => {  //REQUEST TO WRONG PATH------------------------------------------------------------------------------
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {  //ERROR HANDLER--------------------------------------------------------------------------------------
    const { status = 500 } = err
    if(!err.message)    err.message = 'Something Went Wrong'
    res.status(status).render('error', { error: err })
})

app.listen(3000)