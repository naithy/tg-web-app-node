const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};

const token = '6206628203:AAGKvS-tRT3BKXP2YVxUOb0tH1tfFlvYxC8';

const bot = new TelegramBot(token, {polling: true});
const app = express();



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

const httpServer = http.createServer(app)
httpServer.listen(8000, () => {
    console.log("HTTP Server up and running on port 8000");
})