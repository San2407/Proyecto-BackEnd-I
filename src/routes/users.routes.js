import express from "express";
import userModel from "../models/users.models.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
    }
})

export default router;