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
import winston from "./middlewares/winstonLogger.middleware.js";
import winstonLogger from "./config/logger.config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOpts from "./utils/swaggerOpts.js";

const app = express();

connectionDB();
const PORT = config.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(winston);
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

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOpts)));
app.use("/", indexRoutes)

const httpServer = app.listen(PORT, () => {
    winstonLogger.info(`Servidor escuchando en http://localhost:${PORT}`);
});

initializeSocket(httpServer);


