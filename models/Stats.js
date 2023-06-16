const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

const StatisticSchema = new mongoose.Schema({
    countOrders: Number,
    countCompleteOrders: Number,
    totalRevenue: Number,
    revenue: Number
}, {timestamps: true});
module.exports = mongoose.model('Statistic', StatisticSchema);