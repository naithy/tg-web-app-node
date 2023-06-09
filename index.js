const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const Customer = require('./models/Customer')

const options = {
    cert: fs.readFileSync('fullchain.pem'),
    key: fs.readFileSync('privkey.pem')
};

const token = '6206628203:AAGKvS-tRT3BKXP2YVxUOb0tH1tfFlvYxC8';

const bot = new TelegramBot(token, {polling: true});
const app = express();
const server = https.createServer(options, app)

app.use(express.json());
app.use(cors());

const start = async () => {
    try {
        await mongoose.connect('mongodb://94.198.217.174:27017/test', {useNewUrlParser: true})
        server.listen(443, () => {
            console.log('Server running 443 port')
        })
    } catch (e) {
        console.log(e)
    }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    })



app.post('/web-data', async (req, res) => {
    const {user, totalPrice, cart, birthday, number} = req.body;
    try {
        const customer = new Customer({
            first_name: user.first_name,
            chat_id: user.id,
            username: user?.username,
            cart: cart,
            totalPrice: totalPrice,
            birthday: birthday,
            number: number,
        });
        customer.save()
        return res.status(200).json({});
    } catch (e) {
        console.log('error')
        return res.status(500).json({})
    }
})


start()