import jwt from 'jsonwebtoken';
import config from 'config';

const generateToken = (payload: any, duration: string | number) => {
  return jwt.sign(
    { iss: config.get('BE_URL'), ...payload },
    config.get('JWT_SECRET'),
    { expiresIn: duration }
  );
};

const decodeToken = (
  token: string
) /*: { data: any | null; status: string; code: number; message: string } */ => {
  try {
    let verification = jwt.verify(token, config.get('JWT_SECRET'));

    return { message: '', status: 'ok', code: 200, data: verification };
    // we have verified now let us decode
  } catch (error: any) {
    return { message: error.message, status: 'error', code: 404, data: null };
  }
};

export { generateToken, decodeToken };
