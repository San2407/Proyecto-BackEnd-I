import express from "express"
import { cartController } from "../controllers/carts.controller.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import passport from 'passport';
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartController.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const products = await cartController.getProductsInCartById(cartId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post("/:cid/product/:pid", passport.authenticate('current', { session: false }), authorizeRole("user"), async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        await cartController.addProductToCart(cartId, productId, quantity || 1);
        res.status(204).json({ message: "El producto se ha agregado al carrito correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartController.removeProductFromCart(cartId, productId);
        res.status(204).json({ message: "El producto se ha eliminado del carrito correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const { products } = req.body;

    try {
        const updatedCart = await cartController.updateCart(cartId, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        await cartController.updateProductQuantity(cartId, productId, quantity);
        res.status(204).json({ message: "La cantidad del producto se ha actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        await cartController.clearCart(cartId);
        res.status(204).json({ message: "Todos los productos se han eliminado del carrito correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;