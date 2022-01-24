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

const requestPasswordResetValidation: ObjectSchema<{
    email: string;
}> = Joi.object({
    email: Joi.string().email().required()
});

const passwordResetValidation: ObjectSchema<{
    token: string;
    pin: string | number;
    newPassword: string;
    confirmPassword: string;
}> = Joi.object({
    token: Joi.string().required(),
    pin: Joi.string().length(6),
    newPassword: Joi.string().required().min(8),
    confirmPassword: Joi.string().required().min(8)
});

const merchantAccountValidation: ObjectSchema<{
    email: string;
    username: string;
    password: string;
    organisationName: string;
    typeOfOrganisation: string;
    ownerName: string;
    mobileNumber: string;
    address: string;
    ghPostAddress: string;
}> = Joi.object({
    email: Joi.string().required().email(),
    username: Joi.string().required().alphanum().min(5).max(10),
    password: Joi.string().required().min(8),
    ownerName: Joi.string().required().min(5),
    organisationName: Joi.string().required().min(5),
    typeOfOrganisation: Joi.string().required().min(5),
    mobileNumber: Joi.string().required().min(10).max(10).messages({
        'string.base': `'mobile number' should be a type of 'text'`,
        'string.empty': `'mobile number' cannot be an empty field`,
        'string.length': `'mobile number' must be {#limit} characters long`,
        'any.required': `'mobile number' is a required field`
    }),
    address: Joi.string().min(5),
    ghPostAddress: Joi.string().min(7).optional()
}).or('address', 'ghPostAddress');

export {
    loginValidation,
    userValidation,
    accountValidation,
    accountUpdateValidation,
    accountActivationValidation,
    requestPasswordResetValidation,
    passwordResetValidation,
    merchantAccountValidation
};
