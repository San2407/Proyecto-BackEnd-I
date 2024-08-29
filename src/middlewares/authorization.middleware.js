export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (user.role !== requiredRole) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        next();
    };
};