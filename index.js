const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const socketIo = require('socket.io')

const options = {
    cert: fs.readFileSync('fullchain.pem'),
    key: fs.readFileSync('privkey.pem')
};

const token = '6206628203:AAGKvS-tRT3BKXP2YVxUOb0tH1tfFlvYxC8';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(cors())
app.use(express.json())

const server = https.createServer(options, app)

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

const start = async () => {
    try {
        await mongoose.connect('mongodb://94.198.217.174:27017/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        server.listen(443, () => {
            console.log('Server running 443 port')
        })
    } catch (e) {
        console.log(e)
    }
}

io.on('connection',(socket)=>{
    console.log('client connected: ', socket.id)

    socket.join('clock-room')

    socket.on('disconnect', (reason)=> {
        console.log(reason)
    })
})

const db = mongoose.connection;
db.once('open', () => {
    const collection = db.collection('web-data');
    const changeStream = collection.watch();

    // обработка изменений
    changeStream.on('change', (change) => {
        console.log('Change:', change);
    });
});
setInterval(()=>{
    io.to('clock-room').emit('time', new Date())
},1000)


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
});

app.get('/web-data', async (req, res) => {
    try {
        const data = await Customer.find();
        res.json(data); // отправляем данные в формате JSON
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


start()