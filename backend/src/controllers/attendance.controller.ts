import { Request, Response } from 'express';
import { attendanceValidation } from '../validators/event.validations';
import { CResponse } from '../helpers/classes/response.class';

import Attendances from '../models/attendance.model';

const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const validation = await attendanceValidation.validateAsync(data);
        const { user, event } = data;

        // check if the ticket has already been redeemed from purchases
        const att = await addAttendance(user, event);

        if (att.status != 'ok') return CResponse.error(res, { message: att.message });
        return CResponse.success(res, { message: att.message, code: att.code });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

const addAttendance = async (user: string, event: string) => {
    try {
        const checkAttendance = await Attendances.findOne({ user, event });
        if (checkAttendance) return { status: 'error', code: 409, message: 'Already in attendance' };

        const att = await new Attendances({ user, event }).save();
        return { status: 'ok', code: 201, message: 'Authorisation completed successfully! Please enter' };
    } catch (error: any) {
        return { status: 'error', code: 409, message: 'Already in attendance' };
    }
};

export { create, addAttendance };
