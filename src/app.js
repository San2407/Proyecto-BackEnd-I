import express from "express";
import productRoutes from "./routes/products.routes.js"
const app = express();

const PORT = 8080;
app.use(express.json());

app.use("/api/products", productRoutes)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
