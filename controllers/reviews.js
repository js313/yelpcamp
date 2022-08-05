const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.review = async (req, res) => {    //REVIEW----------------------------------------------------------
    const { cid } = req.params
    const campground = await Campground.findById(cid)
    if(req.body.rating < 1) {
        req.flash('error', 'Rating cannot be Zero')
        return res.redirect(`/campgrounds/${cid}`)
    }
    const review = new Review({
        body: req.body.review,
        rating: req.body.rating,
        author: req.user._id
    })
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${cid}`)
}

module.exports.deleteReview = async (req, res) => {   //REVIEW DELETE-----------------------------------------------
    const { cid, rid } = req.params
    const campground = await Campground.findByIdAndUpdate(cid, {$pull: { reviews: rid } })  //Removes all instances with the given condn
    const review = await Review.findByIdAndDelete(rid)
    req.flash('success', 'Review Deleted!')
    res.redirect(`/campgrounds/${cid}`)
}