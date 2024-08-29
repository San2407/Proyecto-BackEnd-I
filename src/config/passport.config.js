import passport from "passport";
import jwt from "passport-jwt";
import localStrategy from "passport-local";
import { JWT_SECRET } from "../utils/jwtFunctions.js";
import userModel from "../models/users.models.js";
import { verifyPassword } from "../utils/hashFunctions.js";
import cookieExtractor from "../utils/cookieExtractor.js";

const LocalStrategy = localStrategy.Strategy;
const jwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

function initializePassport() {
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const existingUser = await userModel.findOne({ email: email });
            const { role } = req.body;
            if (existingUser) {
                return done(null, false, { message: 'Ya existe un usuario con ese correo' });
            }
            const newUser = new userModel({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: email,
                password: password,
                age: req.body.age,
                role: role === 'admin' ? 'admin' : 'user'
            });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            const isPasswordCorrect = await verifyPassword(
                password,
                user.password
            );
            if (!isPasswordCorrect) {
                return done(null, false, { message: "Contraseña incorrecta" });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);

            return done(null, user);
        } catch (error) {
            return done(`Hubo un error: ${error.message}`);
        }
    });

    passport.use('current', new jwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            const user = await userModel.findById(jwtPayload.id);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}

export { initializePassport };