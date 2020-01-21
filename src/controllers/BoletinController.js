'use strict'

const {userTokenHandler, getTurmaId,getBoletinData} = require('../utils/SessionsHandler')
const api = require('../utils/api')


async function getBoletinsPage(cookies){
    
    const response = await api.get(
        '/WebModuleBoletim/interfaceBoletimAction.do?actionType=exibirImplementacao&idAtor=1',{
        headers:{
            Cookie: `${cookies[0]};${cookies[1]}`
        }
    })

    if(!response){
        return false
    }
    return response.data
}
function sanitizeBoletimData(boletimGrid){
    
    const withoutTags = boletimGrid.replace(/(\r\n|\n|\r|\t)/gm, "").replace(/ul id="[^"][^>]*>?/gm, '');
    const labels = withoutTags.split(/<[^>]*>?/gm).map(line=>line.trim());

    const content  = boletimGrid.match(/((?=\()(.*?)(?=\)))/gm)
    
    let sanitizedLabels = labels.filter(function (el) {
        return el != '';
      });

    let response=[]
    for(let i =0; i < sanitizedLabels.length; i++){
        response[i] = {
            label: sanitizedLabels[i],
            boletimId: parseInt(content[i].split(',')[0].replace(/\('/g, "").replace(/'/g, "")),
            ano: parseInt(content[i].split(',')[1].replace(/'/g, "")),
        }
    }
    
    return response

}
function sanitizeBoletinData(boletinData){
    let boletin = []
    for (let index = 0; index < boletinData.length; index++) {
        const Boletin = boletinData[index]
        if(typeof Boletin.indice === 'undefined'){
            const nota_p1 = Boletin.nota_p1!==null?String(Boletin.nota_p1):'-'
            const nota_p2 = Boletin.nota_p2!==null?String(Boletin.nota_p2):'-'
            const nota_p3 = Boletin.nota_p3!==null?String(Boletin.nota_p3):'-'
            const nota_p4 = Boletin.nota_p4!==null?String(Boletin.nota_p4):'-'
            const nota_rf = Boletin.nota_rf!==null?String(Boletin.nota_rf):'-'
            const nota_rec = Boletin.nota_rec!==null?String(Boletin.nota_rec):'-'
            boletin.push({
                materia:Boletin.descricao,
                nota_p1,
                nota_p2,
                nota_p3,
                nota_p4,
                nota_rf,
                nota_rec
            })

        }
       
        
    }
    return boletin
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
        const boletinPage  = await getBoletinsPage(session)
        const boletimGrid = boletinPage.substring(
            boletinPage.lastIndexOf('<ul id="divBoletim_') + 1, 
            boletinPage.lastIndexOf("</ul>")
        );
        const boletins = sanitizeBoletimData(boletimGrid)
        return response.json(boletins)
    },
    
    async show(request, response){
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

        const boletinData = await getBoletinData(session, boletimId, id_turma, ano)
        const boletin = sanitizeBoletinData(boletinData)

        return response.json({info:infoBoletin, data:boletin})

    }
}