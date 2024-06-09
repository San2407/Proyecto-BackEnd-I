import express from "express";
import productRoutes from "./routes/products.routes.js"
import cartsRoutes from "./routes/carts.routes.js"
import handlebars from "express-handlebars"
import __dirname from "./dirname.js";
const app = express();

const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.resolve(__dirname, "./public")));

/*app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
}))*/

//app.set("view engine", "hbs")
//app.set("views", `${__dirname}/views`);

app.use("/api/products", productRoutes)
app.use("/api/carts", cartsRoutes)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
