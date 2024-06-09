import fs from "fs";
import { productManager } from "./products.js";
import __dirname from "../dirname.js";
import path from "path";
class cartManager {
    constructor(path) {
        this.path = path;
        this.carts = this.readCart();
    }
    readCart() {
        if (fs.existsSync(this.path)) {
            try {
                const cartsData = fs.readFileSync(this.path, "utf-8");
                return JSON.parse(cartsData)
            } catch (error) {
                console.log("Error al leer el archivo")
                return [];
            }
        }
    }
    writeCartFile(carts) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(carts, null, "\t"), "utf-8")
            console.log("Se ha agregado con éxito");
        } catch (error) {
            console.error("Error al escribir en el archivo:", error.message)
        }
    }
    createCart() {
        const cartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;

        const newCart = {
            id: cartId,
            products: []
        }

        this.carts.push(newCart);
        this.writeCartFile(this.carts);
        return newCart
    }

    getProductsInCartById(cartId) {
        const id = parseInt(cartId);
        if (isNaN(id)) {
            throw new Error("El id debe ser un número")
        }
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error("No se encontró el carrito")
        }
        return cart ? cart.products : [];
    }
    addProductToCart(cartId, productId) {
        const id = parseInt(cartId);
        if (isNaN(id)) {
            throw new Error("El id del carrito debe ser un número")
        }
        console.log("Lista de carritos cargada:", this.carts);
        const cart = this.carts.find(c => c.id === id);

        if (!cart) {
            throw new Error("Carrito no encontrado. ID del carrito:", id)
        }

        const productExistente = productManager.getProductsById(productId);
        if (!productExistente) {
            throw new Error("Producto no encontrado. ID del producto" + productId)
        }

        const productoEnCarrito = cart.products.find(p => p.id === productId);
        if (productoEnCarrito) {
            productoEnCarrito.quantity += 1;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        this.writeCartFile(this.carts)
    }
}


export const CartManager = new cartManager(
    path.resolve(__dirname, "./data/carts.json")
);