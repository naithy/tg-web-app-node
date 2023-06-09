const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')



const CustomerSchema = new mongoose.Schema({
    first_name: String,
    chat_id: Number,
    username: String,
    totalPrice: Number,
    cart: Object,
    number: Number
}, { timestamps: true });
module.exports = mongoose.model('Customer', CustomerSchema);
