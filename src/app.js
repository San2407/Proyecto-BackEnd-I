import express from "express"
import indexRoutes from "./routes/index.routes.js"
import handlebars from "express-handlebars"
import path from "path"
import __dirname from "./dirname.js";
import connectionDB from "./utils/db.js";
import initializeSocket from "./utils/socket.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";

const app = express();

connectionDB();
const PORT = config.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

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

initializeSocket(httpServer);


