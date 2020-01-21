'use strict'

const {Router} = require('express')

const routes = Router()

const SessionsController = require('./controllers/SessionsController')
const BoletinController = require('./controllers/BoletinController')
const FaltasController = require('./controllers/FaltasController')
routes.get('/',(req, res)=>{
    return res.json({
        message:"Opa, e aew?"
    })
})


routes.post('/sessions', SessionsController.index)
routes.get('/boletins', BoletinController.index)
routes.get('/boletins/view', BoletinController.show)
routes.get('/faltas',FaltasController.index)
module.exports = routes