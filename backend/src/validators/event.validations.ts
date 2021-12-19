import Joi, { ObjectSchema } from 'joi';

const createEventValidation: ObjectSchema<{
    title: string;
    date: Date;
    time: string;
    venue: string;
    flyer: string;
    capacity: string;
    description: string;
    extraDetails?: Array<{}>;
    // photos?: string[];
}> = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    venue: Joi.string().required(),
    description: Joi.string().required(),
    capacity: Joi.string(),
    extraDetails: Joi.array().allow(null),
    // photos: Joi.array().allow(null),
});

const createPurchase: ObjectSchema<{}> = Joi.object({
    user: Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email(),
    }).required(),
    items: Joi.array(),
});

const redeemTicketValidation: ObjectSchema<{}> = Joi.object({
    id: Joi.string().required(),
    hashTicketId: Joi.string().required(),
});

const verifyTicketValidation: ObjectSchema<{}> = Joi.object({
    userId: Joi.string().required(),
    ticketId: Joi.string().required(),
});

const verifyScannedQrCodeValidation: ObjectSchema<{}> = Joi.object({
    scanResult: Joi.string().required(),
});

export {
    createEventValidation,
    createPurchase,
    redeemTicketValidation,
    verifyTicketValidation,
    verifyScannedQrCodeValidation,
};
