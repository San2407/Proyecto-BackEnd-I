import express from "express";
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


router.get("/api/products", (req, res) => {
    try {
        const showProducts = productManager.getProducts();
        res.json(showProducts)
    } catch {
        res.status(500).json({ error: "Error al obtener los productos" })
    }
})

router.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    try {
        const product = productManager.getProductsById(id);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" })
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
})


router.post("/api/products", (req, res) => {
    const newProduct = req.body;
    try {
        productManager.addProduct(newProduct)
        res.status(201).json({ message: "Producto agregado correctamente" })
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto" })
    }
})

router.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const updateProduct = req.body;
    try {
        productManager.updateProduct(id, updateProduct)
        res.status(201).json({ message: "Producto actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
})

router.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    try {
        productManager.deleteProduct(id)
        if (!id) {
            res.status(404).json({ error: "Producto no encontrado" })
        } else {
            res.status(204).json({ message: "Producto eliminado correctamente" })
        }
    } catch {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
})

export default router;