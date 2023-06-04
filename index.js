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
const webAppUrl = 'https://sakurashop.netlify.app';

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
        await bot.sendMessage(5212881326, `Клиент *${user.first_name} ${user?.last_name}* ${user.username ? '@' + user.username : ''}\nCписок товаров: ${
            Object.values(cart)
                .map((value, ) => {
                    const flavors = Object.entries(value.flavors)
                        .map(([flavor, quantity]) => `\n    _• ${flavor} - ${quantity}_`)
                        .join("");
                    return `\n*${value.title}* ${flavors}`;
                })
                .join("\n")
        }\nСумма: *${totalPrice} руб.*`,
            {parse_mode: 'markdown',
                reply_markup: {
                inline_keyboard: [
                    [{text: 'Завершить', web_app: {url: webAppUrl}}, {text: 'Отменить', web_app: {url: webAppUrl}}]
                ]
                }

            })
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