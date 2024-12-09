import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import winstonLogger from "../src/config/logger.config.js";
import mongoose from "mongoose";

const request = supertest(`http://localhost:${config.PORT}`);

describe("Test de productos", () => {
    const adminCredentials = {
        first_name: 'pepe',
        last_name: 'perez',
        email: 'a@b.com',
        age: 20,
        password: '123456',
        role: 'admin'
    }
    let adminToken = "";
    before(async () => {
        try {
            await mongoose.connect(config.DB_URL)
            await request.post('/api/sessions/register').send(adminCredentials);

            const adminLoginResponse = await request.post('/api/sessions/login').send({
                email: adminCredentials.email,
                password: adminCredentials.password
            });

            const cookies = adminLoginResponse.headers['set-cookie'];
            const jwtCookie = cookies.find(cookie => cookie.startsWith('token='));
            expect(jwtCookie).to.not.be.undefined;

            adminToken = jwtCookie.split("=")[1].split(";")[0];
            expect(adminToken).to.not.be.undefined;
            expect(adminToken).to.not.equal('');
        } catch (error) {
            winstonLogger.error({ error: 'Error en el hook before', details: error.message });
        }
    })
    const data = {
        title: 'Producto de prueba',
        description: 'Descripción de prueba',
        price: 100,
        stock: 10,
        thumbnail: 'https://via.placeholder.com/150',
        code: 'ABC123',
        category: 'Electronics'
    };
    let pid = "";
    it('Debería agregar un producto', async () => {
        const response = await request.post('/api/products')
            .set('Cookie', `token=${adminToken}`)
            .send(data);

        const { body, status } = response
        console.log("Respuesta del servidor: ", body);
        expect(status).to.equal(201);

        pid = body.newProduct?._id;
        expect(pid).to.exist;
    })
    it('Debería obtener la pagina de productos ', async () => {
        const response = await request.get('/api/products');
        const { status } = response
        expect(status).to.equal(200);
    })
    it('Debería obtener un producto por el id', async () => {
        expect(pid).to.not.be.empty;
        const response = await request.get(`/api/products/${pid}`);
        const { status } = response
        expect(status).to.equal(200);
    })
    it('Debería actualizar un producto', async () => {
        expect(pid).to.not.be.empty;
        const updatedProduct = {
            title: 'Producto de prueba actualizado',
            description: 'Descripción de prueba actualizada',
            price: 200,
            stock: 20,
            thumbnail: 'https://via.placeholder.com/150',
            code: 'DEF456',
            category: 'Electronics'
        }
        const response = await request.put(`/api/products/${pid}`).set('Cookie', `token=${adminToken}`).send(updatedProduct);
        const { status } = response
        expect(status).to.equal(201);
    })
    it('Debería eliminar un producto', async () => {
        expect(pid).to.not.be.empty;
        const response = await request.delete(`/api/products/${pid}`).set('Cookie', `token=${adminToken}`);
        const { status } = response
        expect(status).to.equal(204);
    })
})

