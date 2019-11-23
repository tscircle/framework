import * as Joi from "@hapi/joi";

const idSchema = Joi.object().keys({
    id: Joi.number().required()
});

export { idSchema };
