import Joi, { ObjectSchema } from 'joi';

const contactUsValidation: ObjectSchema<{
  email: string;
  subject?: string;
  fullName: string;
  message: string;
}> = Joi.object({
  email: Joi.string().email().required(),
  subject: Joi.string().allow(null).optional(),
  fullName: Joi.string().required(),
  message: Joi.string().required()
});


export {contactUsValidation}