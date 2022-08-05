const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const campground = require('../models/campground')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {   //LIST------------------------------------------------------------------------
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newCampground = async (req, res, next) => {  //NEW-------------------------------------------------------------------------
    const geoData = await geoCoder.forwardGeocode({ //forward means from location to coordinates
        query: req.body.location,
        limit: 1
    }).send()
    const { title, price, description, location } = req.body
    const c = new Campground({
        title: title,
        images: req.files.map(f => ({ path: f.path, filename: f.filename })),
        price: price,
        description: description,
        location: location,
        author: req.user._id
    })
    c.geometry = geoData.body.features[0].geometry
    await c.save()
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.newForm = (req, res) => { //NEW FORM-------------------------------------------------------------------------
    res.render('campgrounds/new')
}

module.exports.details = async (req, res) => {   //DETAILS------------------------------------------------------------------
    const { id } = req.params
    const campground = await Campground.findById(id).populate({ //Nested Populate
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')    //Populate the name of the field in camground table not the model name
    if(!campground) {
        req.flash('error', 'No such Campground found!')
        return res.redirect('/campgrounds') //return ends the execution here, else or else express throws error (headers sent)
    }
    res.render('campgrounds/show', { campground })
}

module.exports.editCampground = async (req, res) => {   //EDIT---------------------------------------------------------------------
    const { id } = req.params
    const { title, price, description, location } = req.body
    const imgs = req.files.map(f => ({path: f.path, filename: f.filename}))
    const campground = await Campground.findByIdAndUpdate(id, {
        title: title,
        price: price,
        description: description,
        location: location
    })
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) 
        //we write campground.upd... and not Campground.upd... as the later will require 2 arguments one for searching and the other for 
        //changes, so instead of searching the campground that we need to change again(as we already have that) we use this.
    }
    campground.images.push(...imgs) //spreading imgs or it will add imgs array into images array
    await campground.save()
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${ id }`)
}

module.exports.deleteCampground = async (req, res) => {    //DELETE---------------------------------------------------------------
    const { id } = req.params   //Mongoose Middleware setup in campground model to delete the following reviews
    await Campground.findOneAndDelete({ _id: id })
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}

module.exports.editForm = async (req, res) => {  //EDIT FORM------------------------------------------------------------
    const { id } = req.params
    const c = await Campground.findById(id)
    if(!c) {
        req.flash('error', 'No such Campground found!')
        return res.redirect('/campgrounds') //return ends the execution here, else or else express throws error (headers sent)
    }
    res.render('campgrounds/edit', { campground: c })
}