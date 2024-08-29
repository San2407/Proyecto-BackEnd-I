import mongoose from "mongoose";
import Cart from "../models/carts.models.js";
import Producto from "../models/products.models.js";
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
}

export const cartController = new CartController();