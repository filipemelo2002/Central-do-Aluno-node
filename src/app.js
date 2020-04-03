const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

mongoose.connect('mongodb+srv://centraldoaluno:centraldoaluno@cluster0-6nhph.mongodb.net/CentraldoAluno?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)
module.exports = app
