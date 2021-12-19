import mongoose from 'mongoose';
const mongooseId = () => {
    return mongoose.Types.ObjectId().toString();
};

export { mongooseId };
