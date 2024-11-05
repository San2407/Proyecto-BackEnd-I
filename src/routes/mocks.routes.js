import express from "express";
import { generateMockUsers, generateMockProducts } from "../controllers/mock.controller.js";

const router = express.Router();

router.get("/users/:n", async (req, res) => {
    const numUsers = parseInt(req.params.n, 10);
    if (isNaN(numUsers) || numUsers <= 0) {
        res.status(400).json({ error: "El número debe ser mayor a cero" });
    }
    try {
        const users = await generateMockUsers(numUsers);
        res.status(201).json({ message: "usuarios de prueba generados exitosamente", data: users });
    } catch (error) {
        res.status(500).json({ error: "Error al generar los usuarios de prueba", details: error.message });
    }
})

router.get("/products/:n", async (req, res) => {
    const numProducts = parseInt(req.params.n, 10);
    if (isNaN(numProducts) || numProducts <= 0) {
        res.status(400).json({ error: "El número debe ser mayor a cero" });
    }
    try {
        const products = await generateMockProducts(numProducts);
        res.status(201).json({ message: "productos de prueba generados exitosamente", data: products });
    } catch (error) {
        res.status(500).json({ error: "Error al generar los productos de prueba", details: error.message });
    }
})

export default router;