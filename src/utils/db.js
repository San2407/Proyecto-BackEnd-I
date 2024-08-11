import mongoose from "mongoose";

const dbUrl = 'mongodb://127.0.0.1:27017';
const connectionDB = async () => {
    try {
        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 30000,
        })
        console.log('MongoDB connected')
    } catch (err) {
        console.log(err);
    }
}

export default connectionDB;