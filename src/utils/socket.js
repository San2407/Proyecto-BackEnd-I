import { Server } from "socket.io";
import { productController } from "../controllers/products.controller.js";

export default function initializeSocket(httpServer) {
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("Nuevo Cliente Conectado");

        socket.emit('products', productController.getProducts());

        socket.on('newProduct', (product) => {
            productController.addProduct(product);
            io.emit('products', productController.getProducts());
        });
        socket.on('deleteProduct', (productId) => {
            productController.deleteProduct(productId);
            io.emit('products', productController.getProducts());
        })
    })
}