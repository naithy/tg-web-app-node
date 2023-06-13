const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const socketIo = require('socket.io')
const Product = require('./models/Product')


const options = {
    cert: fs.readFileSync('fullchain.pem'),
    key: fs.readFileSync('privkey.pem')
};

const token = process.env.TOKEN;

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

io.on('connection', async (socket) => {
    try {
        const customers = await Customer.find();
        socket.emit('items', customers);
    } catch (err) {
        console.error(err);
    }

    const changeStream = Customer.watch();
    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const customer = {
                _id: change.fullDocument._id,
                first_name: change.fullDocument.first_name,
                username: change.fullDocument.username,
                totalPrice: change.fullDocument.totalPrice,
                cart: change.fullDocument.cart,
                birthday: change.fullDocument.birthday,
                number: change.fullDocument.number,
                createdAt: change.fullDocument.createdAt,
            };
            socket.emit('changeData', customer);
        } else if (change.operationType === 'update') {
            const updatedCustomer = {
                _id: change.documentKey._id,
                ...change.updateDescription.updatedFields,
            };
            socket.emit('updateData', updatedCustomer);
        } else if (change.operationType === 'delete') {
            socket.emit('deleteData', change.documentKey._id);
        }
    });
});


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

        return res.status(201).json({});
    } catch (e) {
        console.log(e)
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


app.delete('/web-data', async (req, res) => {
    try {
        const {id} = req.body
        await Customer.deleteOne({ _id: id })
        res.status(200)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

// app.get('/product/hqd', async (req, res) => {
//     try {
//         const data = await
//     }
// })

start()