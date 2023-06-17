const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const socketIo = require('socket.io')
const Product = require('./models/Product')
const bodyParser = require('body-parser')
const CompleteOrder = require('./models/CompletedOrder')
const Statistic = require('./models/Stats')


const options = {
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
};

const token = process.env.TOKEN;

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());


const server = https.createServer(options, app)

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

const start = async () => {
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27001/test', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // })
        server.listen(443, () => {
            console.log('Server running 443 port')
        })
    } catch (e) {
        console.log(e)
    }
};


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
    });


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
});

app.get('/product', async (req, res) => {
    try {
        const category = req.query.category;
        if (!!category) {
            const data = await Product.find({category} )
            res.json(data)
        } else {
            const data = await Product.find()
            res.json(data)
        }
    } catch (e) {
        console.error('Error fetching products:', e);
        res.sendStatus(500);
    }
});

app.post('/product', async (req, res) => {
    const {category, title, price, flavors, description, img} = req.body
    try {
        const product = new Product({
            category,
            title,
            price,
            flavors,
            description,
            img
        });
        product.save()
    } catch (e) {
        console.log(e)
    }

});

app.delete('/product', async (req, res) => {
    const {id} = req.body
    console.log(id)
    try {
        await Product.deleteOne({_id: id})
    } catch (e) {
        console.log(e)
    }
});

app.put('/product', async (req, res) => {
    const {_id} = req.body
    try {
        await Product.replaceOne({_id}, req.body)
    } catch (e) {
        console.log(e)
    }
});

app.post('/complete-order', async (req, res) => {
    const {_id, first_name, username, totalPrice, cart, birthday, number, createdAt, defected, revenue} = req.body;
    try {
        const completedOrder = new CompleteOrder({
            _id: _id,
            first_name: first_name,
            username: username,
            cart: cart,
            totalPrice: totalPrice,
            revenue: revenue,
            birthday: birthday,
            number: number,
            createdAt1: createdAt,
            defected: defected,
        });
        await completedOrder.save()
    } catch (e) {
        console.log(e)
    }
});

app.get('/complete-order', async (req, res) => {
    try {
        const data = await CompleteOrder.find();
        res.json(data)
    } catch (e) {
        console.log(e)
    }
});

app.get('/stats', async (req, res) => {
    try {
        const count = await CompleteOrder.countDocuments({});
        const result = await CompleteOrder.aggregate([{ $group: {_id: null, totalRevenue: {$sum: "$revenue" } } }]);
        const result2 = result[0]?.totalRevenue || 0
        const result3 = await CompleteOrder.aggregate([{ $group: {_id: null, totalPrice: {$sum: "$totalPrice" } } }]);
        const result4 = result3[0]?.totalPrice || 0
        const id = '648c9369a4896442f8b8a21e';
        const updateData = { totalRevenue: result2, countCompleteOrders: count, revenue: result4 }
        const options = { new: true };
        const updatedDocument = await Statistic.findByIdAndUpdate(id, updateData, options)
        await updatedDocument.save()
        const data = await Statistic.find();
        res.json(data)
    } catch (e) {
        console.log(e)
    }
})

start()