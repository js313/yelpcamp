const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type:'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                })
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

const campgroundSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array()
})

module.exports.campgroundSchema = campgroundSchema  //as we are destructuring from this file we need to create an object

const reviewSchema = Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5)
})

module.exports.reviewSchema = reviewSchema