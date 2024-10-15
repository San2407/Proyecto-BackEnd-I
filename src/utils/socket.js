import { Server } from "socket.io";
import { productController } from "../controllers/products.controller.js";

// Función para inicializar Socket.io con el servidor de Express
export default function initializeSocket(httpServer) {
    const io = new Server(httpServer);

    io.on("connection", async (socket) => {
        try {
            console.log("Nuevo Cliente Conectado");

            // Obtener la lista de productos y emitirla al cliente conectado
            const products = await productController.getProducts();
            socket.emit('products', products);

            // Escuchar el evento 'newProduct' cuando el cliente envía un nuevo producto
            socket.on('newProduct', async (product) => {
                try {
                    await productController.addProduct(product);
                    const updatedProducts = await productController.getProducts();
                    io.emit('products', updatedProducts);
                } catch (error) {
                    console.error(error);
                }
            })

            // Escuchar el evento 'deleteProduct' cuando el cliente envía un ID de producto para eliminar
            socket.on('deleteProduct', async (productId) => {
                try {
                    await productController.deleteProduct(productId);
                    const updatedProducts = await productController.getProducts();
                    io.emit('products', updatedProducts);
                } catch (error) {
                    console.error(error);
                }
            })

        } catch (error) {
            console.error("Error al conectar el cliente:", error);
        }
    })
}