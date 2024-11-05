import winstonLogger from "../config/logger.config.js";

export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            winstonLogger.warn({ error: 'Usuario no autenticado' });
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (user.role !== requiredRole) {
            winstonLogger.warn({ error: 'No tienes permisos para realizar esta acción' });
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        next();
    };
};