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
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
    apis: [`${__dirname}/docs/*.yaml`],
}

export default swaggerOpts