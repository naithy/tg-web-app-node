const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')



const CustomerSchema = new mongoose.Schema({
    user: String,
    chat_id: Number,
    title: String,
    price: Number,
    flavors: Object
});
module.exports = mongoose.model('Customer', CustomerSchema);
