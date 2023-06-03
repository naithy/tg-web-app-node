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
                    label: `${rest.title} ${flavor}`,
                    amount: rest.price * 100
                });
            });
            return acc;
        }, []);
        console.log('data received')
        await bot.answerWebAppQuery(queryID, {
            type: 'article',
            id: queryID,
            title: `${title}`,
            input_message_content: {message_text: `Заказ успешно оформлен`}
        })
    } catch (e) {
        console.log('error')
    }
})

let saveNewCart;
const title = 'Заказ #1313'

const PORT = 8000;
app.listen(PORT, () => console.log('Server started on port:' + PORT));