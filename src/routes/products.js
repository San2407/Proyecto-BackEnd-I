import fs from "fs";

class Product {
    constructor(title, description, code, price, stock, category, status) {
        this.id = 0;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.status = status
        this.category = category;
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
    async addProduct(product) {
        if (
            !product.title ||
            !product.description ||
            !product.code ||
            !product.price ||
            !product.stock ||
            !product.category
        ) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some((p) => p.code === product.code)) {
            console.log("El código ya existe");
            return;
        }

        if (this.products.length > 0) {
            const newId = this.products[this.products.length - 1].id + 1;
            product.id = newId;
        } else {
            product.id = 1;
        }

        if (product.status === undefined) {
            product.status = true;
        }

        this.products.push(product)

        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, "\t")
            )
            console.log("Se agrego el producto correctamente");
        } catch (error) {
            console.log(error);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductsById(idProduct) {
        if (isNaN(Number(idProduct))) {
            console.log("El id debe ser un numero")
            return
        }

        const product = this.products.find((product) => product.id === Number(idProduct))
        if (!product) {
            return "No se encontró el producto";
        }
        return product;
    }

    deleteProduct(idProduct) {
        const numericIdProduct = Number(idProduct);
        const productIndex = this.products.findIndex((product) => product.id === numericIdProduct);
        if (productIndex === -1) {
            console.log("No se encontró el producto");
            return;
        }
        this.products.splice(productIndex, 1);

        try {
            if (fs.existsSync(this.path)) {

                fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
                console.log("Se elimino correctamente");
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateProduct(idProduct, product) {
        const numericIdProduct = Number(idProduct);
        const productIndex = this.products.findIndex((product) => product.id === numericIdProduct);

        const productOld = this.products[productIndex];

        if (productIndex === -1) {
            console.log("No se encontró el producto");
            return;
        }

        this.products[productIndex] = {
            ...productOld,
            ...product,
        };

        try {
            fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
        } catch (error) {
            console.log(error);
        }
    }
}

export default new ProductManager("./src/data/products.json")

