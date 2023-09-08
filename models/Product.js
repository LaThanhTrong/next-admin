// import { Schema, model, models } from "mongoose"
const { Schema, default: mongoose } = require("mongoose"); 

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    images: [{type: String}],
    category: {type: mongoose.Types.ObjectId, ref: 'Category'},
    properties: {type:Object},
}, {
    timestamps: true,
})

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);