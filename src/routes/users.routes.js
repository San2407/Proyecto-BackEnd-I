import express from "express";
import userModel from "../models/users.models.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        winstonLogger.error({ error: "Error al obtener los usuarios", details: error.message });
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
})

export default router;