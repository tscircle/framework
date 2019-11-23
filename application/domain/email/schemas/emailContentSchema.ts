import * as Joi from "@hapi/joi";

const emailContentSchema = Joi.object().keys({
    data: Joi.string().required(),
    html: Joi.string().required(),
    active: Joi.boolean(),
});

const editEmailContentSchema = Joi.object().keys({
    mjml: Joi.string(),
    html: Joi.string(),
    active: Joi.boolean(),
});

export { emailContentSchema, editEmailContentSchema };
