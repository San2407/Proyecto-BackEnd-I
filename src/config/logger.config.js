import { createLogger, format, transports, addColors } from "winston";

const { colorize, combine, timestamp, json, printf, errors } = format;
const { Console, File } = transports;

const levels = { error: 0, warn: 1, info: 2, http: 3 };
const colors = { error: "red", warn: "yellow", info: "blue", http: "white" };
addColors(colors);

const consoleFormat = combine(
    colorize(),
    printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${typeof message === "object" ? JSON.stringify(message) : message}`;
    })
);
const fileFormat = combine(
    timestamp(),
    json(),
    errors({ stack: true })
);

const winstonLogger = createLogger({
    levels,
    format: format.combine(timestamp()),
    transports: [
        new Console({ level: "info", format: consoleFormat }),
        new File({ level: "warn", format: fileFormat, filename: "./src/utils/errors/errors.log" })
    ]
});

export default winstonLogger;