import { Request } from 'express';
import Joi, { ObjectSchema } from 'joi';
import multer from 'multer';
import path from 'path';

const mongoidValidation: ObjectSchema<{ _id: string }> = Joi.object({
    _id: Joi.string().required(),
});


const storage = multer .diskStorage({
    destination: function(req: Request, file: Express.Multer.File, cb) {
    
        const filePath = path.join(__dirname, '../../public/uploads');
        console.log('file path', filePath)
        cb(null, filePath);
    }, 
    filename: function(req: Request, file: Express.Multer.File, cb) {
        cb(null, file.fieldname +  "-" + Date.now() + path.extname(file.originalname));
    }
});

//Image Validation Schema
const photograph = multer({
    limits: {
        fileSize: 3145728 , // 3MB
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|PNG|JPG|jpg|JPEG|jpeg)/))
            return callback(new Error('File format not support'));
        callback(null, true);
    },
    storage

});


// const upload = multer({
//     storage: storage
// });

export { mongoidValidation, photograph };
