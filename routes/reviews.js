const express = require('express')
const CatchAsync = require('../utils/CatchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review')
const { isLoggedIn, validateReview, isReviewAutorized } = require('../middleware')
const reviews = require('../controllers/reviews')
const router = express.Router({ mergeParams: true })

router.post('', isLoggedIn, CatchAsync(reviews.review)) //REVIEW----------------------------------------------------------

router.delete('/:rid', isLoggedIn, isReviewAutorized, CatchAsync(reviews.deleteReview)) //REVIEW DELETE---------------------------------------

module.exports = router