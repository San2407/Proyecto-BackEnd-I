import express from "express"
import passport from "passport"
import { generateToken } from "../utils/jwtFunctions.js"
import { UserDto } from "../dtos/user.dto.js";

const router = express.Router();

router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ error: info.message });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    })(req, res, next);
})

router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) return next(err)

        if (!user) {
            return res.status(400).json({ message: info ? info.message : 'Error al iniciar sesión' })
        }

        const token = generateToken({ id: user._id })

        res.cookie('token', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
        res.status(200).json({ message: 'Sesión iniciada exitosamente', user });
    })(req, res, next);
})

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        const userDTO = new UserDto(req.user);
        res.json({ message: 'Usuario autenticado', user: userDTO });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
})

export default router;