const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: String,
    price: Number,
    flavors: Array,
    description: String,
    img: String
});

module.exports = mongoose.model('Product', ProductSchema)