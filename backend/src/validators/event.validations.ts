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
    extraDetails: Joi.array().allow(null)
    // photos: Joi.array().allow(null),
});

const createPurchase: ObjectSchema<{}> = Joi.object({
    user: Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email()
    }).required(),
    items: Joi.array()
});

const redeemTicketValidation: ObjectSchema<{}> = Joi.object({
    userId: Joi.string().required(),
    purchaseId: Joi.string().required(),
    redemptionCode: Joi.string().required()
});

const verifyTicketValidation: ObjectSchema<{}> = Joi.object({
    userId: Joi.string().required(),
    ticketId: Joi.string().required()
});

const verifyScannedQrCodeValidation: ObjectSchema<{}> = Joi.object({
    scanResult: Joi.string().required()
});

const addConfirmationValidation: ObjectSchema<{}> = Joi.object({
    name: Joi.string().required(),
    mobileNumber: Joi.string().required().length(10).label('Mobile Number')
});

const attendanceValidation: ObjectSchema<{}> = Joi.object({
    user: Joi.string().required(),
    event: Joi.string().required()
});

export {
    createEventValidation,
    createPurchase,
    redeemTicketValidation,
    verifyTicketValidation,
    verifyScannedQrCodeValidation,
    addConfirmationValidation,
    attendanceValidation
};
