import express from "express";
import { productController } from "../controllers/products.controller.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import passport from 'passport';
import winstonLogger from "../config/logger.config.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const showProducts = await productController.getProducts(parseInt(page) || 1, parseInt(limit) || 10);
        res.status(200).json(showProducts)
    } catch {
        winstonLogger.error({ error: "Error al obtener los productos", details: error.message });
        res.status(500).json({ error: "Error al obtener los productos" })
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productController.getProductsById(id);
        if (!product) {
            winstonLogger.warn({ error: "Producto no encontrado" });
            res.status(404).json({ error: "Producto no encontrado" })
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        winstonLogger.error({ error: "Error al obtener el producto", details: error.message });
        res.status(500).json({ error: "Error al obtener el producto" })
    }
})


router.post("/", passport.authenticate('current', { session: false }), authorizeRole("admin"), async (req, res) => {
    const newProduct = req.body;
    try {
        await productController.addProduct(newProduct)
        res.status(201).json({ message: "Producto agregado correctamente" })
    } catch (error) {
        winstonLogger.error({ error: "Error al agregar el producto", details: error.message });
        res.status(500).json({ message: "Error al agregar el producto" })
    }
})

router.put("/:id", passport.authenticate('current', { session: false }), authorizeRole("admin"), async (req, res) => {
    const { id } = req.params;
    const updateProduct = req.body;
    try {
        await productController.updateProduct(id, updateProduct)
        res.status(201).json({ message: "Producto actualizado correctamente" })
    } catch (error) {
        winstonLogger.error({ error: "Error al actualizar el producto", details: error.message });
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
})

router.delete("/:id", passport.authenticate('current', { session: false }), authorizeRole("admin"), async (req, res) => {
    const { id } = req.params;
    try {
        await productController.deleteProduct(id)
        if (!id) {
            winstonLogger.warn({ error: "Producto no encontrado" });
            res.status(404).json({ error: "Producto no encontrado" })
        } else {
            res.status(204).json({ message: "Producto eliminado correctamente" })
        }
    } catch {
        winstonLogger.error({ error: "Error al eliminar el producto", details: error.message });
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
})

export default router;