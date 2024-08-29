import mongoose from "mongoose";
import { createHash } from "../utils/hashFunctions.js";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

userSchema.pre('save', async function (next) {
    const hashedPassword = await createHash(this.password);
    this.password = hashedPassword;
    next();
});

const userModel = mongoose.model('User', userSchema);
export default userModel
