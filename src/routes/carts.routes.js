import express from "express"
import CartManager from "./carts.js"

const router = express.Router();

router.post("/", (req, res) => {
    try {
        const newCart = CartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
})

router.get("/:cid", (req, res) => {
    const cartId = req.params.cid;
    const products = CartManager.getProductsInCartById(cartId);
    res.json(products);
})

router.post("/:cid/product/:id", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.id;

    if (isNaN(cartId) || !productId) {
        return res.status(400).json({ error: "Parámetros Invalidas" })
    }
    try {
        CartManager.addProductToCart(cartId, productId);
        res.status(204).json({ message: "El producto se ha agregado al carrito correctamente" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;