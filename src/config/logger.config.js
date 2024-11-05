import { createLogger, format, transports, addColors } from "winston";

const { colorize, simple } = format;
const { Console, File } = transports;

const levels = { error: 0, warn: 1, info: 2, http: 3 };
const colors = { error: "red", warn: "yellow", info: "blue", http: "white" };
addColors(colors);

const winstonLogger = createLogger({
    levels,
    format: colorize(),
    transports: [
        new Console({ level: "info", format: simple() }),
        new File({ level: "warn", format: simple(), filename: "./src/utils/errors/errors.log" })
    ]
});

export default winstonLogger;