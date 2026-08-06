const Joi = require('joi');


exports.createProductSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required(),
        description: Joi.string().optional(),
        price: Joi.number().required(),
        category: Joi.string().hex().length(24).optional(),
    }),
})