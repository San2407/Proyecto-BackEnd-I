import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";

const request = supertest(`http://localhost:${config.PORT}`);

describe('Mock Rutas', () => {
    describe('GET /api/mocks/users/:n', () => {
        it('Debería retornar una lista de usuarios mockeados', async () => {
            const response = await request.get('/api/mocks/users/5');
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', 'usuarios de prueba generados exitosamente');
            expect(response.body).to.have.property('data').that.is.an('array').with.lengthOf(5);
        });

        it('Debería retornar error 400 si el parámetro no es válido', async () => {
            const response = await request.get('/api/mocks/users/0');
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'El número debe ser mayor a cero');
        });

    });

    describe('GET /api/mocks/products/:n', () => {
        it('Debería retornar una lista de productos mockeados', async () => {
            const response = await request.get('/api/mocks/products/3');
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', 'productos de prueba generados exitosamente');
            expect(response.body).to.have.property('data').that.is.an('array').with.lengthOf(3);
        });

        it('Debería retornar error 400 si el parámetro no es válido', async () => {
            const response = await request.get('/api/mocks/products/0');
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'El número debe ser mayor a cero');
        });
    });
})