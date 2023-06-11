const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

let current = new Date();

function getTimeStamp() {
    return new Date(Date.UTC(current.getFullYear(), current.getMonth(), current.getDate(),
        current.getHours(), current.getMinutes(), current.getSeconds()));
}

const CustomerSchema = new mongoose.Schema({
    first_name: String,
    chat_id: Number,
    username: String,
    totalPrice: Number,
    cart: Object,
    birthday: String,
    number: String,
    dateTime: {type: Date, default: getTimeStamp()}
});
module.exports = mongoose.model('Customer', CustomerSchema);
