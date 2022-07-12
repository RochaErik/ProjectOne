const Joi = require('joi');

module.exports.movieSchema = Joi.object({
    movie: Joi.object({
        title: Joi.string().required(),
        release: Joi.date().required(),
        genre: Joi.string().required(),
        director: Joi.string().required(),
        runtime: Joi.number().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});
