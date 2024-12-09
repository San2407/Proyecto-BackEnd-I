import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import userModel from "../src/models/users.models.js";
import mongoose from "mongoose";

const request = supertest(`http://localhost:${config.PORT}`);

describe("Sessions Rutas", () => {
    const dataRegister = {
        email: "a@b.com",
        password: "123456",
        first_name: "pepe",
        last_name: "perez",
        age: 20,
        role: "user"
    }
    const data = {
        email: "a@b.com",
        password: "123456"
    }
    before(async () => {
        try {
            await mongoose.connect(config.DB_URL)
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error);
            throw error;
        }
    })
    beforeEach(async () => {
        try {
            await userModel.deleteOne({ email: dataRegister.email });
        } catch (error) {
            console.error("Error al limpiar la base de datos:", error);
            throw error;
        }
    })

    describe('POST /api/sessions/register', () => {
        it('Debería registrar un nuevo usuario', async () => {
            const response = await request.post('/api/sessions/register').send(dataRegister);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', 'Usuario registrado exitosamente');
            expect(response.body).to.have.property('user').that.is.an('object');
        });
    });

    describe('POST /api/sessions/login', () => {
        it('Debería iniciar sesión y generar un token', async () => {
            await request.post('/api/sessions/register').send(dataRegister);

            const response = await request.post('/api/sessions/login').send(data);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Sesión iniciada exitosamente');
            expect(response.body).to.have.property('user').that.is.an('object');
            const cookie = response.headers['set-cookie'];
            expect(cookie).to.be.not.undefined;
        });
    });

    describe('GET /api/sessions/current', () => {
        it('Debería retornar el usuario autenticado', async () => {
            await request.post('/api/sessions/register').send(dataRegister);

            const loginResponse = await request.post('/api/sessions/login').send(data);

            const cookies = loginResponse.headers['set-cookie'];

            const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));

            expect(tokenCookie).to.not.be.undefined;
            const response = await request.get('/api/sessions/current').set('Cookie', tokenCookie);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Usuario autenticado');
            expect(response.body).to.have.property('user').that.is.an('object');
        });
    });
});