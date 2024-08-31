import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const JWT_SECRET = config.JWT_SECRET;
export { JWT_SECRET };
export function generateToken(payload) {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "2h",
    });
    return token;
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error(`Invalid token: ${error}`);
    }
}