const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('fullchain.pem'),
    key: fs.readFileSync('privkey.pem')
};

const token = '6206628203:AAGKvS-tRT3BKXP2YVxUOb0tH1tfFlvYxC8';

const bot = new TelegramBot(token, {polling: true});
const app = express();

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId)
    })


app.use(express.json());
app.use(cors());

const server = https.createServer(options, app)

app.post('/web-data', async (req, res) => {
    const {queryId, user, totalPrice, cart} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}`
            }
        })
        await bot.sendMessage(5212881326, `Клиент ${user.first_name} ${user?.last_name} 
        ${user.username ? '@' + user.username : ''}, список товаров: ${cart.map(item => item.title).join(', ')},
        Сумма: ${totalPrice}`)
        return res.status(200).json({});
    } catch (e) {
        console.log('error')
        return res.status(500).json({})
    }
})

let saveNewCart;
const title = 'Заказ #1313'

server.listen(443, () => {
    console.log('Server running 443 port')
})