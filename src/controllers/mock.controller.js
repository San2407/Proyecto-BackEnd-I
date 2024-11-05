import { faker } from "@faker-js/faker";
import UserModel from "../models/users.models.js";
import Producto from "../models/products.models.js";

export const generateMockUsers = async (numUsers) => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        const user = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 99 }),
            password: faker.internet.password(),
            role: 'user'
        };
        users.push(user);
    }
    return await UserModel.insertMany(users);
}

export const generateMockProducts = async (numProducts) => {
    const products = [];
    for (let i = 0; i < numProducts; i++) {
        const product = {
            code: faker.string.uuid(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            stock: faker.number.int({ min: 1, max: 100 }),
            category: faker.commerce.department()
        };
        products.push(product);
    }
    return await Producto.insertMany(products);
}
