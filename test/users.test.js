import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import winstonLogger from "../src/config/logger.config.js";
import mongoose from "mongoose";

const request = supertest(`http://localhost:${config.PORT}`);

describe('Users Rutas', () => {
    it('Debería obtener los usuarios', async () => {
        const response = await request.get('/api/users');
        const { status, body } = response
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
    })
})
