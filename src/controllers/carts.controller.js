import mongoose from "mongoose";
import Cart from "../models/carts.models.js";
import Producto from "../models/products.models.js";
import { ticketModel } from "../models/ticket.model.js";
import { sendPurchaseEmail } from "../config/email.config.js";
import winstonLogger from "../config/logger.config.js";
class CartController {
    async createCart() {
        const newCart = new Cart({ products: [] })
        await newCart.save();
        return newCart
    }

    async getProductsInCartById(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error("El id debe ser un objetoID valido")
        }
        const cart = await Cart.findById(cartId).populate('products.productId')
        if (!cart) {
            throw new Error("No se encontró el carrito");
        }
        return cart.products
    }
    async addProductToCart(cartId, productId, quantity = 1) {
        if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("Los ids deben ser ObjectId válidos");
        }

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const product = await Producto.findById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        const productInCart = cart.products.find(p => p.productId.toString() === productId);
        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ productId: productId, quantity })
        }

        await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("El id debe ser un ObjectId válido");
        }
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        cart.products = cart.products.filter(p => !p.productId.equals(productId));

        await cart.save();
    }
    async updateCart(cartId, products) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error("El id debe ser un ObjectId válido");
        }

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        cart.products = products.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
        }));
        await cart.save();
        return cart;
    }
    async updateProductQuantity(cartId, productId, quantity) {
        if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("El id debe ser un ObjectId válido");
        }

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const existingProduct = cart.products.find(p => p.productId.equals(productId));
        if (!existingProduct) {
            throw new Error("Producto no encontrado en el carrito");
        }

        existingProduct.quantity = quantity;
        await cart.save();
    }
    async clearCart(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error("El id debe ser un ObjectId válido");
        }

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        cart.products = [];
        await cart.save();
    }

    async purchaseCart(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await Cart.findById(cartId).populate('products.productId');

            if (!cart) {
                winstonLogger.warn({ error: 'Carrito no encontrado' });
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            let totalAmount = 0;
            const productsOutOfStock = [];

            for (const item of cart.products) {
                const product = item.productId;
                const quantity = item.quantity;

                if (product.stock >= quantity) {
                    product.stock -= quantity;
                    totalAmount += product.price * quantity;
                    await product.save();
                } else {
                    productsOutOfStock.push({
                        productId: product._id,
                        productName: product.name,
                        quantity: quantity,
                        stock: product.stock
                    });
                }
            }
            if (productsOutOfStock.length > 0) {
                winstonLogger.warn({ error: 'Stock insuficiente en los siguientes productos', details: productsOutOfStock });
                return res.status(400).json({
                    message: "Stock insuficiente en los siguientes productos:",
                    details: productsOutOfStock
                });
            }

            if (totalAmount > 0) {
                const ticket = await ticketModel.create({
                    purchase_datetime: new Date(),
                    amount: totalAmount,
                    purchaser: req.user._id
                });

                cart.products = cart.products.filter(item => !productsOutOfStock.some(p => p.productId.equals(item.productId)));
                await cart.save();

                try {
                    await sendPurchaseEmail(req.user, ticket);
                } catch (emailError) {
                    winstonLogger.error('Error al enviar el email', emailError);
                    return res.status(201).json({
                        message: "Compra realizada con éxito, pero no se pudo enviar el correo de confirmación",
                        ticket
                    });
                }
                res.status(201).json({ message: "compra realizada con éxito", ticket });
            }

        } catch (error) {
            res.status(500).json({ error: "Error al realizar la compra", details: error.message });
        }
    }
}

export const cartController = new CartController();