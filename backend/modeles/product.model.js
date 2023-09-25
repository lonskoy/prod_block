import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type_product: {
        type: String,
        required: true
    },
    subtype: {
        type: String,
        required: true
    },
    product_unit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    fileName: {
        type: String,
        required: false
    },
    path: {
        type: String,
        required: false
    }

});

export default mongoose.model('Products', ProductSchema);

