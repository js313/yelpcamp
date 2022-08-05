const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema  //For less typing

const ImageSchema = new Schema({
    path: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.path.replace('/upload', '/upload/w_200')    //cloudinary provides an api to manipulate images here we are displaying images with 200px width
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],  //Nothing changes if we put the values directly here it's just that we can define a virtual function on image only rather than the whole campground Schema
    price: Number,
    description: String,
    location: String,
    geometry: { //to store geo json data from mapbox
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type:[Number],  //array for longitude and latitude resp.
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'   //Name of model created
        }
    ]
}, { toJSON: { virtuals: true } })  //to convert the properties virtual added to the campground schema to JSON, with other properties

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.location}</p>`
})

CampgroundSchema.post('findOneAndDelete', async (deletedCG) => {    //This should be defined before making the model
    if(deletedCG)
    {
        await Review.deleteMany({_id: { $in: deletedCG.reviews }})
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)