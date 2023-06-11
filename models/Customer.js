const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

let current = new Date();

current.setHours(current.getHours() + 4);

const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(),current.getDate(),current.getHours(),
    current.getMinutes(),current.getSeconds(), current.getMilliseconds()));


const CustomerSchema = new mongoose.Schema({
    first_name: String,
    chat_id: Number,
    username: String,
    totalPrice: Number,
    cart: Object,
    birthday: String,
    number: String,
    dateTime: {type: Date, default: timeStamp}
}, { timestamps: true });
module.exports = mongoose.model('Customer', CustomerSchema);
