import mongoose from "mongoose";
import { config } from "../config/config.js";
import winstonLogger from "../config/logger.config.js";

const connectionDB = async () => {
    try {
        await mongoose.connect(config.DB_URL, {
            serverSelectionTimeoutMS: 30000,
        })
        winstonLogger.info('MongoDB connected')
    } catch (err) {
        winstonLogger.error('Error al conectar con la base de datos:', err);
    }
}

export default connectionDB;