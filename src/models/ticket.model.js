import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        default: uuidv4
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

ticketSchema.pre("findOne", async function (next) {
    this.populate("purchaser");
    next();
})

export const ticketModel = model("ticket", ticketSchema);