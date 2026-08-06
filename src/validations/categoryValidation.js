const Joi = require('joi');


exports.createCategorySchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        isActive: Joi.boolean(),
}),
})