import express from "express"
import Producto from "../models/products.models.js"

const router = express.Router();

router.get("/", async (req, res) => {
    const { page, limit } = req.query;
    try {
        const productos = await Producto.paginate({}, { limit, page })
        res.status(200).render("home", { productos });
    } catch (error) {
        winstonLogger.error({ error: "Error al obtener los productos", details: error.message });
        res.status(500).json({ error: "Error al obtener los productos" });
    }
})
router.get("/realTimeProducts", (req, res) => {
    try {
        res.status(200).render("realTimeProducts");
    } catch (error) {
        winstonLogger.error({ error: "Error al obtener los productos", details: error.message });
        res.status(500).json({ error: "Error al obtener los productos" });
    }
})

export default router