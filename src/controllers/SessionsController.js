'use strict'

const User = require('../models/UserModel')
const md5 = require('js-md5')

const {handleLogin} = require('../utils/SessionsHandler')
module.exports = {

    async index(request, response){
        
        const {email, senha} = request.body
        if(!email || !senha){
            return response.status(400).json({message: 'Missing parameters'})
        }   
        
        const responseApi = await handleLogin(email, senha)
        
        const {message} = responseApi.data

        if(message){
            return res.status(400).json({message})
        }

        const {link} = responseApi.data

        if(link){
            let user = await User.findOne({
                email,
                senha
            })
    
            if(!user){
                user = await User.create({
                    email,
                    senha,
                    userToken: md5(email)
                })
            }
    
            return response.json(user)
        }
        return response.status(400).json({message: 'Usuário não autenticado'})
    }
}