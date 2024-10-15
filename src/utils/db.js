import mongoose from "mongoose";
import { config } from "../config/config.js";

const connectionDB = async () => {
    try {
        await mongoose.connect(config.DB_URL, {
            serverSelectionTimeoutMS: 30000,
        })
        console.log('MongoDB connected')
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err);
    }
}

export default connectionDB;