import * as Joi from "@hapi/joi";

const emailSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
});

const editEmailSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30),
});

export { emailSchema, editEmailSchema };
