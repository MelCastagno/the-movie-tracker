// schemas.js

const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!' 
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                    return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension);

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        movieId: Joi.string().required().escapeHTML(),
        posted: Joi.date(),
        score: Joi.number().required().min(1).max(5),
        review: Joi.string().escapeHTML(),
        userId: Joi.string().escapeHTML(),
        userName: Joi.string().escapeHTML(),
        userIMG: Joi.string().escapeHTML()
    }).required()
})
 

module.exports.userSchema = Joi.object({
    user: Joi.object({
        userIMG: Joi.string().escapeHTML(),
        email: Joi.string().required().escapeHTML(),
        lists: [{
            listName: Joi.string().escapeHTML(),
            movies: [{
                movieId: Joi.string().escapeHTML(),
                added: Joi.date(),
                review: Joi.string().escapeHTML(),
                score: Joi.number().min(1).max(5)
            }]
        }]
    }).required()
})

