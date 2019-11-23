import * as Joi from "@hapi/joi";

const emailTypeSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
});

const editEmailTypeSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30),
});

export { emailTypeSchema, editEmailTypeSchema };
