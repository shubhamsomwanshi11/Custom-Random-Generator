const express = require('express')
const boydparser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8989;
mongoose.set('strictQuery', false);
app.use(express.json({ limit: '5mb' }));
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.Mongo_URI);
        console.log("MongoDB Connected" + conn.connection.host);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const routes = require('./routes');
app.use(cors())
app.use(boydparser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use("/", routes);
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`The server is started on the port no: ${PORT}`);
    });
});
