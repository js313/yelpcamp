const multer  = require('multer')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema, reviewSchema } = require('./schemas')

const isLoggedIn = function (req, res, next) {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in!')
        return res.redirect('/login')
    }
    next()
}

const isAuthorized = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

const isReviewAutorized = async (req, res, next) => {
    const { id, rid } = req.params
    const review = await Review.findById(rid)
    if(!review.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

const validateCampground = (req, res, next) => {    //To Validate the informaton coming from new campground form
    const result = campgroundSchema.validate(req.body)
    if(result.error) {
        const msg = result.error.details.map( i => i.message ).join(',')
        throw new ExpressError(msg, 400)
    }
    else
    {
        next()
    }
}

const vaidateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body)
    if(result.error) {
        const msg = result.error.details.map( i => i.message ).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

module.exports = { isLoggedIn, isAuthorized, validateCampground, vaidateReview, isReviewAutorized }