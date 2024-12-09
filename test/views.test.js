import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import winstonLogger from "../src/config/logger.config.js";
import mongoose from "mongoose";

const request = supertest(`http://localhost:${config.PORT}`);

describe('Views Rutas', () => {
    before(async () => {
        try {
            await mongoose.connect(config.DB_URL)
        } catch (error) {
            winstonLogger.error('Error al conectar a MongoDB:', error);
            throw error;
        }
    })
    it('Debería obtener la vista home', async () => {
        const response = await request.get('/').query({ page: 1, limit: 10 });
        const { status, text } = response
        expect(status).to.equal(200);
        expect(text).to.contain('<html');
        expect(text).to.contain('Tabla de productos');
    })
    it("Debe renderizar la vista de 'realTimeProducts'", async () => {
        const response = await request.get("/realTimeProducts");
        const { status, text } = response
        expect(status).to.equal(200);
        expect(text).to.include("<html");
        expect(text).to.include("Productos en Tiempo Real");
    })
})