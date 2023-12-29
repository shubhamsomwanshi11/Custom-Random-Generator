const locationroutes = require('./routes')
const express = require('express')
const boydparser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
const PORT = 8989;
const Mongo_URI = 'mongodb://localhost/custom_generator';
app.use(express.json({ limit: '5mb' }));
mongoose.connect(Mongo_URI);

const routes = require('./routes');
app.use(cors())
app.use(boydparser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use("/", routes)
app.use("/location", locationroutes)
app.listen(PORT, () => { console.log(`The server is started on the port no: ${PORT}`); })