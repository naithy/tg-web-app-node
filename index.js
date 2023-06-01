const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')


const token = '6206628203:AAGKvS-tRT3BKXP2YVxUOb0tH1tfFlvYxC8';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


app.post('/web-data', async (req, res) => {
    const {queryID, cart} = req.body;
    try {
        const newCart = Object.entries(cart).reduce((acc, [key, item]) => {
            const { flavors, ...rest } = item;
            Object.keys(flavors).forEach(flavor => {
                acc.push({
                    title: `${rest.title} ${flavor}`,
                    price: rest.price * 100
                });
            });

            return acc;
        }, []);
        console.log(newCart)
        saveNewCart = newCart
        console.log(saveNewCart)
    } catch (e) {
        console.log('error')
    }
})
bot.onText(/\/pay/, (msg) => {
    console.log(saveNewCart)
    const chatId = msg.chat.id

    bot.sendInvoice(
        chatId,
        title,
        'dssd',
        'payload',
        '1744374395:TEST:b86b8d2a26f4473364a2',
        'RUB',
        {
            saveNewCart
        }
    )
})

let saveNewCart;
const title = 'Заказ #1313'

bot.on('pre_checkout_query', (query) => {
    bot.answerPreCheckoutQuery(query.id, true)
})
bot.on('successful_payment', function (msg) {
    bot.sendMessage(chatId, `Payment for ${msg.successful_payment.total_amount} ${msg.successful_payment.currency} received!`);
});

const PORT = 8000;
app.listen(PORT, () => console.log('Server started on port:' + PORT));