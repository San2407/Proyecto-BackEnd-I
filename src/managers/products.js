import mongoose from "mongoose";
import Producto from "../models/products.models.js"
class ProductManager {
    async addProduct(product) {
        const { title, description, code, price, stock, status, category, thumbnails } = product;
        if (
            !title ||
            !description ||
            !code ||
            !price ||
            !stock ||
            !category
        ) {
            throw new Error("Todos los campos son obligatorios");
        }

        const existingProduct = await Producto.findOne({ code });
        if (existingProduct) {
            throw new Error("El código ya existe")
        }

        const newProduct = new Producto({ title, description, code, price, stock, category, status, thumbnails });
        await newProduct.save();
    }

    async getProducts(page = 1, limit = 10) {
        const options = {
            page,
            limit,
        };
        const result = await Producto.paginate({}, options);
        const response = {
            status: "success",
            ...result,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null,
        }
        return response;
    }

    async getProductsById(idProduct) {
        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            throw new Error("El id debe ser un ObjectId válido");
        }

        const product = await Producto.findById(idProduct)
        if (!product) {
            throw new Error("No se encontró el producto");
        }
        return product;
    }

    async deleteProduct(idProduct) {
        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            throw new Error("El id debe ser un ObjectId válido");
        }
        const product = await Producto.findByIdAndDelete(idProduct);
        if (!product) {
            throw new Error("No se encontró el producto")
        }
    }

    async updateProduct(idProduct, product) {
        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            throw new Error("El id debe ser un ObjectId válido");
        }

        const updatedProduct = await Producto.findByIdAndUpdate(idProduct, product, { new: true })
        if (!updatedProduct) {
            throw new Error("No se encontró el producto")
        }

        return updatedProduct;
    }
}


export const productManager = new ProductManager();
