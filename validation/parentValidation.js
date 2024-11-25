const Joi = require('joi');

const parentSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(10).max(12).required(),
    photo: Joi.string().required(),
    email: Joi.string().email().required(),
    /* children: Joi.array().items(
        Joi.object({
            name: Joi.string().min(3).max(30).required(),
            age: Joi.number().integer().min(0).max(18).required()
        })
    ).min(1).required() */
});

module.exports = parentSchema;