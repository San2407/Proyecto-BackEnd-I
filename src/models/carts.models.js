import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
})

const Cart = model('Cart', cartSchema);
export default Cart