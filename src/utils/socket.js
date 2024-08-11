import { Server } from "socket.io";
import { productManager } from "../managers/products.js";

export default function initializeSocket(httpServer) {
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("Nuevo Cliente Conectado");

        socket.emit('products', productManager.getProducts());

        socket.on('newProduct', (product) => {
            productManager.addProduct(product);
            io.emit('products', productManager.getProducts());
        });
        socket.on('deleteProduct', (productId) => {
            productManager.deleteProduct(productId);
            io.emit('products', productManager.getProducts());
        })
    })
}