'use strict'


const express = require('express')
const routes = require('./src/routes')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb+srv://centraldoaluno:centraldoaluno@cluster0-6nhph.mongodb.net/CentraldoAluno?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json())
app.use(routes)

app.listen(3000)