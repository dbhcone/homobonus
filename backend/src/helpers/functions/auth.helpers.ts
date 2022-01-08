import jwt from 'jsonwebtoken';
import config from 'config';
import { Response, NextFunction } from 'express';
import Users from '../../models/user.model';

const generateToken = (payload: any, duration: string | number) => {
    return jwt.sign({ iss: config.get('BE_URL'), ...payload }, config.get('JWT_SECRET'), { expiresIn: duration });
};

const decodeToken = (token: string) /*: { data: any | null; status: string; code: number; message: string } */ => {
    try {
        let verification = jwt.verify(token, config.get('JWT_SECRET'));
        const data = JSON.parse(JSON.stringify(verification));

        return { message: '', status: 'ok', code: 200, data };
        // we have verified now let us decode
    } catch (error: any) {
        return { message: error.message, status: 'error', code: 404, data: null };
    }
};

const verifyToken = async (req: any, res: Response, next: NextFunction) => {
    try {
        //Get Authorization
        const authorizationHeader = req.headers['authorization'];

        if (authorizationHeader === undefined) return res.status(404).send({ error: 'Authentication required!' });

        const bearerToken = authorizationHeader.split(' ')[1];
        const tokenObj = decodeToken(bearerToken);

        if (tokenObj == null) return res.status(401).send({ error: 'Invalid token' });

        //Get Token expiry
        const expireDate = tokenObj.data.exp;
        //Check if token is expired
        if (Date.now() >= expireDate * 1000) return res.status(401).send({ error: 'Token Expired' });

        const udata = await userData(tokenObj.data.id);

        req.userData = udata;
        next();
    } catch (error: any) {
        return res.status(404).send({ error: error.message });
    }
};

const userData = async (_id: string) => {
    const udata = await Users.findById(_id, { password: 0 }).populate('accountOwner');
    return udata;
};

export { generateToken, decodeToken, verifyToken };
