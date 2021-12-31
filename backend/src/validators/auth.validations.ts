import Joi, { ObjectSchema } from 'joi';

const accountActivationValidation: ObjectSchema<{
    // token: string;
    pin: string;
    mobileNumber: string;
}> = Joi.object({
    // token: Joi.string().required(),
    mobileNumber: Joi.string().required().length(10),
    pin: Joi.string().required().length(6)
});

const loginValidation: ObjectSchema<{
    username: string;
    password: string;
}> = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const userValidation: ObjectSchema<{
    username: string;
    email: string;
    password: string;
    role?: string;
}> = Joi.object({
    username: Joi.string().required().min(8),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().default('user')
});

const accountValidation: ObjectSchema<{
    surname: string;
    firstName: string;
    otherNames?: string;
    gender: string;
    primaryMobileNumber: string;
    otherNumbers: string[];
    occupation: string;
}> = Joi.object({
    surname: Joi.string().required().min(3),
    firstName: Joi.string().required().min(3),
    otherNames: Joi.string().allow(null),
    gender: Joi.string().required().length(1),
    primaryMobileNumber: Joi.string().required().min(10).max(15).messages({
        'string.base': `'primary mobile number' should be a type of 'text'`,
        'string.empty': `'primary mobile number' cannot be an empty field`,
        // 'string.length': `'primary mobile number' should have a length of {#limit}`,
        'any.required': `'primary mobile number' is a required field`
    }),
    occupation: Joi.string().min(5).allow(null)
});

const accountUpdateValidation = Joi.object({
    _id: Joi.string().required().label('Account Id'),
    updateData: Joi.object({
        email: Joi.string().email(),
        surname: Joi.string().min(3),
        firstName: Joi.string().min(3),
        otherNames: Joi.string().allow(null),
        gender: Joi.string().length(1),
        primaryMobileNumber: Joi.string().min(10).max(15).messages({
            'string.base': `'primary mobile number' should be a type of 'text'`,
            'string.empty': `'primary mobile number' cannot be an empty field`
        }),
        occupation: Joi.string().min(5).allow(null)
    }).required()
});
export { loginValidation, userValidation, accountValidation, accountUpdateValidation, accountActivationValidation };
