const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

const CompleteOrderSchema = new mongoose.Schema({
    first_name: String,
    chat_id: Number,
    username: String,
    totalPrice: Number,
    revenue: Number,
    cart: Object,
    birthday: String,
    number: String,
    defected: Object,
}, {timestamps: true});
module.exports = mongoose.model('CompleteOrder', CompleteOrderSchema);