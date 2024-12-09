import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import winstonLogger from "../src/config/logger.config.js";
import mongoose from "mongoose";

const request = supertest(`http://localhost:${config.PORT}`);

describe('Carts Rutas', () => {
    const userCredentials = {
        first_name: 'Marco',
        last_name: 'Silva',
        email: 'm@s.com',
        age: 20,
        password: '123456',
        role: 'user'
    }
    let userToken = "";
    const adminCredentials = {
        first_name: 'Luciano',
        last_name: 'Blanco',
        email: 'l@b.com',
        age: 20,
        password: '123456',
        role: 'admin'
    }
    let adminToken = "";
    let pid1 = "";
    let pid2 = "";
    const productData = {
        title: 'Producto de prueba 1',
        description: 'Descripción de prueba 1',
        price: 100,
        stock: 50,
        code: 'TEST123',
        category: 'TestCategory',
        thumbnails: ['https://via.placeholder.com/150']
    }
    let pid3 = "";
    before(async () => {
        try {
            await mongoose.connect(config.DB_URL)
            await request.post('/api/sessions/register').send(userCredentials);
            const userLoginResponse = await request.post('/api/sessions/login').send({
                email: userCredentials.email,
                password: userCredentials.password
            });

            const cookies = userLoginResponse.headers['set-cookie'];
            const jwtCookie = cookies.find(cookie => cookie.startsWith('token='));
            expect(jwtCookie).to.not.be.undefined;

            userToken = jwtCookie.split("=")[1].split(";")[0];
            expect(userToken).to.not.be.undefined;
            expect(userToken).to.not.equal('');

            //Crear productos de prueba
            const mockProducts = await request.get('/api/mocks/products/2');
            expect(mockProducts.body.data).to.be.an('array').that.has.lengthOf(2);

            pid1 = mockProducts.body.data[0]._id;
            pid2 = mockProducts.body.data[1]._id;
            expect(pid1).to.exist;
            expect(pid2).to.exist;
            // Agregar productData
            await request.post('/api/sessions/register').send(adminCredentials);
            const adminLoginResponse = await request.post('/api/sessions/login').send({
                email: adminCredentials.email,
                password: adminCredentials.password
            });

            const adminCookies = adminLoginResponse.headers['set-cookie'];
            const adminJwtCookie = adminCookies.find(cookie => cookie.startsWith('token='));
            expect(adminJwtCookie).to.not.be.undefined;

            adminToken = adminJwtCookie.split("=")[1].split(";")[0];
            expect(adminToken).to.not.be.undefined;
            expect(adminToken).to.not.equal('');

            const responseProduct = await request.post('/api/products')
                .set('Cookie', `token=${adminToken}`)
                .send(productData);
            pid3 = responseProduct.body.newProduct._id;
            expect(pid3).to.exist;

        } catch (error) {
            winstonLogger.error({ error: 'Error en el hook before', details: error.message });
            throw error;
        }

    })
    let cid = "";
    it('Crear carrito', async () => {
        const response = await request.post('/api/carts').set('Cookie', `token=${userToken}`);
        const { status, body } = response

        expect(status).to.equal(201);
        cid = body._id;
        expect(cid).to.exist;
    })
    it('Agregar productos al carrito', async () => {
        expect(cid).to.exist;
        expect(pid1).to.exist;
        const response = await request.post(`/api/carts/${cid}/product/${pid1}`)
            .set('Cookie', `token=${userToken}`)
            .send({ quantity: 1 });

        const { status } = response
        expect(status).to.equal(204);
    })
    it('Actualizar carrito ', async () => {
        expect(cid).to.exist;
        expect(pid2).to.exist;
        expect(pid3).to.exist;
        await request.post(`/api/carts/${cid}/product/${pid2}`)
            .set('Cookie', `token=${userToken}`)
            .send({ quantity: 1 });

        const productToUpdate = [
            { productId: pid3, quantity: 2 },
        ]
        expect(productToUpdate).to.be.an('array').that.has.lengthOf(1);

        const response = await request.put(`/api/carts/${cid}`).send({ products: productToUpdate });

        const { status } = response
        expect(status).to.equal(200);

    })
    it('Obtener los productos del carrito por id', async () => {
        expect(cid).to.exist;
        const response = await request.get(`/api/carts/${cid}`);
        const { status } = response
        expect(status).to.equal(200);
    })
    it('Actualizar la cantidad del producto en el carrito', async () => {
        const response = await request.put(`/api/carts/${cid}/products/${pid3}`)
            .set('Cookie', `token=${userToken}`)
            .send({ quantity: 5 });

        const { status } = response
        expect(status).to.equal(204);
    })
    it('Eliminar un producto del carrito', async () => {
        expect(cid).to.not.be.empty;
        expect(pid1).to.not.be.empty;
        await request.post(`/api/carts/${cid}/product/${pid1}`).set('Cookie', `token=${userToken}`);

        const response = await request.delete(`/api/carts/${cid}/products/${pid3}`).set('Cookie', `token=${userToken}`);
        const { status } = response
        expect(status).to.equal(204);
    })
    it('hacer checkout', async function () {
        expect(cid).to.not.be.empty;
        const response = await request.post(`/api/carts/${cid}/purchase`).set('Cookie', `token=${userToken}`);
        const { status } = response
        expect(status).to.equal(201);
    })
    it('Eliminar carrito', async () => {
        expect(cid).to.not.be.empty;
        const response = await request.delete(`/api/carts/${cid}`).set('Cookie', `token=${userToken}`);
        const { status } = response
        expect(status).to.equal(204);
    })
    after(async () => {
        await request.delete(`/api/products/${pid1}`).set('Cookie', `token=${adminToken}`);
        await request.delete(`/api/products/${pid2}`).set('Cookie', `token=${adminToken}`);
        await request.delete(`/api/products/${pid3}`).set('Cookie', `token=${adminToken}`);
    })
})