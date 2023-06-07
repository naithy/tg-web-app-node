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
    const {queryId, user, totalPrice, cart, chat} = req.body;
    try {
        // await bot.answerWebAppQuery(queryId, {
        //     type: 'article',
        //     id: queryId,
        //     title: 'Успешная покупка',
        //     input_message_content: {
        //         message_text: `Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}`
        //     }
        // })
        await bot.sendMessage(user.id, `\nЗаказ: ${
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
                    [{text: 'Подтвердить', callback_data: "accept"}, {text: 'Отменить',  callback_data: "delete"}]
                ]
                }

            })

        const customer = new Customer({
            first_name: user.first_name,
            chat_id: user.id,
            username: user?.username,
            cart: cart,
            totalPrice: totalPrice,

        });

        bot.on("callback_query", (query) => {
            const queryChatId = query.message.chat.id;
            const messageId = query.message.message_id;
            if (query.data === "accept") {
                bot.deleteMessage(queryChatId, messageId);
                customer.save().then(() => bot.deleteMessage(queryChatId, messageId))
            }
            if (query.data === "delete") {
                bot.deleteMessage(queryChatId, messageId);
            }
        });


        return res.status(200).json({});
    } catch (e) {
        console.log('error')
        return res.status(500).json({})
    }
})


start()