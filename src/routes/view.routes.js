import express from "express"
import { productManager } from "../managers/products.js"

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const showProducts = productManager.getProducts();
        res.render("home", { products: showProducts });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
})
router.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts");
})

export default router