const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')



const CustomerSchema = new mongoose.Schema({
    first_name: String,
    chat_id: Number,
    username: String,
    title: String,
    totalPrice: Number,
    flavors: Object
});
module.exports = mongoose.model('Customer', CustomerSchema);
