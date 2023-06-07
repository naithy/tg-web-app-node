const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const Customer = require('./models/Customer')

const options = {
    // cert: fs.readFileSync('fullchain.pem'),
    // key: fs.readFileSync('privkey.pem')
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
        app.listen(443, () => {
            console.log('Server running 443 port')
        })
    } catch (e) {
        console.log(e)
    }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    })

bot.on("callback_query", (query) => {
    const queryChatId = query.message.chat.id;
    const messageId = query.message.message_id;
    if (query.data === "delete") {

        bot.deleteMessage(queryChatId, messageId);
    }
});

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
        await bot.sendMessage(5212881326, `\nCписок товаров: ${
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
                    [{text: 'Подтвердить', callback_data: "delete"}, {text: 'Отменить',  callback_data: "delete"}]
                ]
                }

            })

        for (const key in cart) {
            if (cart.hasOwnProperty(key)) {
                try {
                    const customer = new Customer({
                        user: user,
                        chat_id: chat,
                        title: cart[key].title,
                        price: cart[key].price,
                        flavors: cart[key].flavors
                    });
                    customer.save().then(() => console.log('User saved'))
                }   catch (e) {
                    console.log(e)
                }


            }
        }

        return res.status(200).json({});
    } catch (e) {
        console.log('error')
        return res.status(500).json({})
    }
})


start()