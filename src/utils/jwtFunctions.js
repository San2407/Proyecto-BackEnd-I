import jwt from "jsonwebtoken";

export const JWT_SECRET = "g3h31m";

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