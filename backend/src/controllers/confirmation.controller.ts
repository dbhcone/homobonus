import { Request, Response } from 'express';
import { CResponse } from '../helpers/classes/response.class';
import Events from '../models/event.model';
import Confirmations from '../models/confirmation.model';
import { addConfirmationValidation } from '../validators/event.validations';

const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const validation = await addConfirmationValidation.validateAsync(data);

        const confirmation = await new Confirmations(data).save();

        return CResponse.success(res, { data: confirmation });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

const read = async (req: Request, res: Response) => {
    try {
        const confirmations = await Confirmations.find();
        return CResponse.success(res, { message: 'Confirmations fetched successfully!', data: confirmations });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

export { read, create };
