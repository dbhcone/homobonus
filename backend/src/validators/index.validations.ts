import Joi, { ObjectSchema } from 'joi';

const contactUsValidation: ObjectSchema<{
    email: string;
    subject?: string;
    fullName: string;
    message: string;
    mobileNumber: string;
}> = Joi.object({
    email: Joi.string().email().required(),
    subject: Joi.string().allow(null).optional(),
    fullName: Joi.string().required(),
    message: Joi.string().required(),
    mobileNumber: Joi.string().max(10)
}).or('email', 'mobileNumber');

export { contactUsValidation };
