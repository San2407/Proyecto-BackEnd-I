import express from "express"
import { cartController } from "../controllers/carts.controller.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import passport from 'passport';
import winstonLogger from "../config/logger.config.js";
const router = express.Router();

router.post("/", passport.authenticate('current', { session: false }), authorizeRole("user"), async (req, res) => {
    try {
        const newCart = await cartController.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        winstonLogger.error({ error: "Error al crear el carrito", details: error.message });
        res.status(500).json({ error: "Error al crear el carrito" });
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const products = await cartController.getProductsInCartById(cartId);
        res.status(200).json(products);
    } catch (error) {
        winstonLogger.error({ error: "Error al obtener los productos del carrito", details: error.message });
        res.status(500).json({ error: "Error al obtener los productos del carrito" });
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
        winstonLogger.error({ error: "Error al agregar el producto al carrito", details: error.message });
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartController.removeProductFromCart(cartId, productId);
        res.status(204).json({ message: "El producto se ha eliminado del carrito correctamente" });
    } catch (error) {
        winstonLogger.error({ error: "Error al eliminar el producto del carrito", details: error.message });
        res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
});

router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const { products } = req.body;

    try {
        const updatedCart = await cartController.updateCart(cartId, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        winstonLogger.error({ error: "Error al actualizar el carrito", details: error.message });
        res.status(500).json({ error: "Error al actualizar el carrito" });
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
        winstonLogger.error({ error: "Error al actualizar la cantidad del producto en el carrito", details: error.message });
        res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
    }
});

router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        await cartController.clearCart(cartId);
        res.status(204).json({ message: "Todos los productos se han eliminado del carrito correctamente" });
    } catch (error) {
        winstonLogger.error({ error: "Error al vaciar el carrito", details: error.message });
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
});

router.post('/:cid/purchase',
    passport.authenticate('current', { session: false }),
    authorizeRole("user"),
    async (req, res) => cartController.purchaseCart(req, res));

export default router;