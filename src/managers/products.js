import fs from "fs";

class Product {
    constructor(title, description, code, price, stock, category, status, thumbnails) {
        this.id = 0;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.status = status
        this.category = category;
        this.thumbnails = thumbnails;
    }
}

class ProductManager {
    constructor(path) {
        this.path = path;

        if (fs.existsSync(this.path)) {
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
        }
    }
    async writeProducts(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
            console.log("Operación completada correctamente")
        } catch (error) {
            console.error(error)
        }
    }
    async addProduct(product) {
        const { title, description, code, price, stock, category } = product;
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

        if (this.products.some((p) => p.code === product.code)) {
            throw new Error("El código ya existe");
        }

        if (this.products.length > 0) {
            const newId = this.products[this.products.length - 1].id + 1;
            product.id = newId;
        } else {
            product.id = 1;
        }

        const newProduct = new Product(
            title,
            description,
            code,
            price,
            stock,
            category,
        )
        newProduct.id = product.id
        if (product.status === undefined) {
            newProduct.status = true;
        }
        if (product.thumbnails === undefined) {
            newProduct.thumbnails = [];
        }

        this.products.push(newProduct)
        await this.writeProducts(this.products)
    }

    getProducts() {
        return this.products;
    }

    getProductsById(idProduct) {
        if (isNaN(Number(idProduct))) {
            throw new Error("El id debe ser un numero");
        }

        const product = this.products.find((product) => product.id === Number(idProduct))
        if (!product) {
            throw new Error("No se encontró el producto");
        }
        return product;
    }

    deleteProduct(idProduct) {
        const numericIdProduct = Number(idProduct);
        const productIndex = this.products.findIndex((product) => product.id === numericIdProduct);
        if (productIndex === -1) {
            throw new Error("No se encontró el producto");
        }
        this.products.splice(productIndex, 1);
        this.writeProducts(this.products)
    }

    updateProduct(idProduct, product) {
        const numericIdProduct = Number(idProduct);
        const productIndex = this.products.findIndex((product) => product.id === numericIdProduct);

        if (productIndex === -1) {
            throw new Error("No se encontró el producto");
        }

        const productOld = this.products[productIndex];

        const updatedProduct = {
            id: numericIdProduct,
            title: product.title || productOld.title,
            description: product.description || productOld.description,
            code: product.code || productOld.code,
            price: product.price || productOld.price,
            stock: product.stock || productOld.stock,
            status: product.status ?? productOld.status,
            category: product.category || productOld.category,
            thumbnails: product.thumbnails || productOld.thumbnails,
        };

        this.products[productIndex] = updatedProduct;
        this.writeProducts(this.products)
    }
}

export default new ProductManager("./src/data/products.json")

