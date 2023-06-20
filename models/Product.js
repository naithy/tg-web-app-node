const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

const ProductSchema = new mongoose.Schema({
    category: String,
    brand: String,
    brandImg: String,
    title: String,
    price: Number,
    flavors: Object,
    description: String,
    img: String
});

module.exports = mongoose.model('Product', ProductSchema)