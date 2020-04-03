'use strict'

const { Router } = require('express')

const routes = Router()
const AuthUser = require('./middlewares/auth')
const AuxFunctions = require('./jobs/AuxFunctions')
const SessionsController = require('./controllers/SessionsController')
const BoletinController = require('./controllers/BoletinController')
const FaltasController = require('./controllers/FaltasController')
const HorariosController = require('./controllers/HorariosController')
routes.get('/', (req, res) => {
  return res.json({
    message: 'Opa, e aew?'
  })
})

routes.post('/sessions', SessionsController.index)
routes.get('/boletins', AuthUser.authUser, BoletinController.index)
routes.get('/boletins/view', AuthUser.authUser, AuxFunctions.handleParameters, BoletinController.show)
routes.get('/faltas', AuthUser.authUser, AuxFunctions.handleParameters, FaltasController.index)
routes.get('/horarios', AuthUser.authUser, HorariosController.index)
module.exports = routes
