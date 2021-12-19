import { Request, Response } from 'express';
import { contactUsValidation } from '../validators/index.validations';
import Enquiries from '../models/contactus.model';

const ContactUs = async (req: Request, res: Response) => {
  try {
    const validation = await contactUsValidation.validateAsync(req.body);

    const enquiry = await new Enquiries(req.body).save();

    return res
      .status(201)
      .json({
        message: 'Thank you for submitting your message!',
        status: 'ok',
        code: 201,
        data: enquiry,
      });
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: error.message, code: 404, status: 'error' });
  }
};

export { ContactUs };
