import express from "express"
import indexRoutes from "./routes/index.js"
import handlebars from "express-handlebars"
import path from "path"
import __dirname from "./dirname.js";
import { Server } from "socket.io"
import { productManager } from "./managers/products.js";
import connectionDB from "./db.js";
const app = express();

connectionDB();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))

app.set("view engine", "hbs")
app.set("views", `${__dirname}/views`);

app.use("/", indexRoutes)

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

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
