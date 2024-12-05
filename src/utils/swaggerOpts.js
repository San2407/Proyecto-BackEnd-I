import __dirname from "../dirname.js";

export const swaggerOpts = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentación de la API",
            description: "Documentación de la API de la aplicación de e-commerce",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [`${__dirname}/docs/*.yaml`],
}

export default swaggerOpts