const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')


const token = '6206628203:AAGKvS-tRT3BKXP2YVxUOb0tH1tfFlvYxC8';

const bot = new TelegramBot(token, {polling: true});
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

const httpProxy = createProxyMiddleware({
    target: 'http://77.105.172.20:8000', // адрес вашего HTTP-приложения
    changeOrigin: true,
});


app.use(express.json());
app.use(cors());
app.use('/web-data', httpProxy)

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