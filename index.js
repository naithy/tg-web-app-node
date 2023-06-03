const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware');

const token = '6206628203:AAGKvS-tRT3BKXP2YVxUOb0tH1tfFlvYxC8';

const bot = new TelegramBot(token, {polling: true});
const app = express();

const target = 'http://77.105.172.20';


const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false
});

app.use('/api', proxy);
app.use(express.json());
app.use(cors());


app.post('/web-data', async (req, res) => {
    const {queryID, cart} = req.body;
    try {
        console.log('fetched')
        return res.status(200).json({});
    } catch (e) {
        console.log('error')
        return res.status(500).json({})
    }
})

let saveNewCart;
const title = 'Заказ #1313'

const PORT = 8000;
app.listen(PORT, () => console.log('Server started on port:' + PORT));