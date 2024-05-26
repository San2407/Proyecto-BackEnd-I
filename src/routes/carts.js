import fs from "fs";

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
            console.log("El id debe ser un número")
            return "El id debe ser un número"
        }
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            return "No se encontró el carrito";
        }
        return cart ? cart.products : [];
    }
    addProductToCart(cartId, productId) {
        const id = parseInt(cartId);
        if (isNaN(id)) {
            console.log("El id del carrito debe ser un número")
            return ("El id del carrito debe ser un número")
        }
        console.log("Lista de carritos cargada:", this.carts);
        const cart = this.carts.find(c => c.id === id);

        if (!cart) {
            console.log("Carrito no encontrado. ID del carrito:", id)
            return
        }

        const productExistente = cart.products.find(p => p.id === productId);
        if (productExistente) {
            productExistente.quantity += 1;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        this.writeCartFile(this.carts)
    }
}

export default new cartManager("./src/data/carts.json")