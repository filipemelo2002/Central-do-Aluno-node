'use strict'
const api = require('../utils/api')
const qs = require('querystring')

const User = require('../models/UserModel')

async function handleLogin(login, senha){
    const formBody = {
        login,
        senha
    }
    const response = await api.post(
        '/GerenciadorAcessoWeb/segurancaAction.do?actionType=ajaxLogin&dummy=',
        qs.stringify(formBody))

    return response
}

async function getUserCredentials(userToken){
    const user = await User.findOne({userToken})
    if(user){
        return user
    }
    return false
}
function getHeadersToReturnJSession(loginSubscription){
    const {headers} = loginSubscription
    return headers['set-cookie']
}
module.exports = {

    async handleLogin(login, senha){
        const formBody = {
            login,
            senha
        }
        const response = await api.post(
            '/GerenciadorAcessoWeb/segurancaAction.do?actionType=ajaxLogin&dummy=',
            qs.stringify(formBody))
    
        return response
    },
    async userTokenHandler(userToken){

        const userAuthorized = await getUserCredentials(userToken)
        if(!userAuthorized){
            return false
        }
        const {email, senha} = userAuthorized

        const loginSubscription = await handleLogin(email, senha)
        if(!loginSubscription){
            return false
        }
        const session = getHeadersToReturnJSession(loginSubscription)
        return session
    },
    async  getTurmaId(cookies, boletimId){
        const response = await api.get(
            `/ws/eol/aluno/documentos/BoletimEscolar/alunoMatricula?idAlunoMatricula=${boletimId}&isInterface=true&request.preventCache=`,{
            headers:{
                Cookie: `${cookies[0]};${cookies[1]}`
            }
        })
    
        if(!response){
            return false
        }
        return response.data[0]
    },
    async getBoletinData(cookies, boletimId, id_turma, ano){
        const response = await api.get(
            `/ws/eol/aluno/documentos/BoletimEscolar/componenteCurricular?idAlunoMatricula=${boletimId}&idTurma=${id_turma}&ano=${ano}&isInterface=true&request.preventCache=`,{
            headers:{
                Cookie: `${cookies[0]};${cookies[1]}`
            }
        })
        if(!response){
            return false
        }
        return response.data
    }
}