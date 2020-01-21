'use strict'

const {userTokenHandler, getTurmaId,getBoletinData} = require('../utils/SessionsHandler')
const api = require('../utils/api')

async function getPercentFaltas(cookies, boletimId, id_turma, ano){
    const response = await api.get(
        `/ws/eol/aluno/documentos/BoletimEscolar/percentualFaltas?idAlunoMatricula=${boletimId}&idTurma=${id_turma}&ano=${ano}&isInterface=true&request.preventCache=`,{
        headers:{
            Cookie: `${cookies[0]};${cookies[1]}`,
        }
    })

    if(!response){
        return false
    }
    
    return response.data
}

function sanitizeFaltasAmount(faltasData){
    const faltas = []
    for (let index = 0; index < faltasData.length; index++) {
        const f = faltasData[index];
        if(typeof f.indice === 'undefined'){
            const {fnj_p1, fj_p1, fnj_p2,fj_p2, fnj_p3, fj_p3, fnj_p4, fj_p4} = f
            faltas.push({
                materia: f.descricao,
                fnj_p1,
                fj_p1,
                fnj_p2,
                fj_p2,
                fnj_p3,
                fj_p3,
                fnj_p4,
                fj_p4
            })
        }
        
    }
    return faltas
}
module.exports = {
    async index(request, response){
        const {usertoken} = request.headers
        
        if(!usertoken){
            return response.status(400).json({
                message: 'Usuário não autenticado'
            })
        }
        const session = await userTokenHandler(usertoken)
        if(!session){
            return response.status(400).json({
                message: 'Usuário não autenticado'
            })
        }

        const {boletimId, ano} = request.query
        if(!boletimId||!ano){
            return response.status(400).json({
                message: 'Missing parameters'
            })
        }
        
        const infoBoletin = await getTurmaId(session, boletimId)
        const {id_turma} = infoBoletin
        if(!id_turma){
            return response.status(400).json({
                message: 'Error getting data'
            })
        }

        const percent = await getPercentFaltas(session, boletimId, id_turma, ano)
        const boletinData = await getBoletinData(session, boletimId, id_turma, ano)
        const faltasCount = sanitizeFaltasAmount(boletinData)
        return response.json({percent, details:faltasCount})
    }
}