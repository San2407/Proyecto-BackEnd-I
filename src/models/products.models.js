import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const { Schema, model } = mongoose;

const productoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: {
        type: [String],
        default: [],
    },
})
productoSchema.plugin(mongoosePaginate);
const Producto = model("Producto", productoSchema);
export default Producto;