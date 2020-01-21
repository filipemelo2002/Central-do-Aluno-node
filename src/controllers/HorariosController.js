'use strict'

const {userTokenHandler} = require('../utils/SessionsHandler')
const api = require('../utils/api')
function getStringBetween(str, prefix, suffix) {
	let s = str;
	var i = s.indexOf(prefix);
	if (i >= 0) {
		s = s.substring(i + prefix.length);
	}
	else {
		return '';
	}
	if (suffix) {
		i = s.indexOf(suffix);
		if (i >= 0) {
			s = s.substring(0, i);
		}
		else {
		  return '';
		}
	}
	return s;
};
async function getHorariosTable(cookies){
    let response = await api.get(
        `/quadrodehorarios/DetalharQuadroHorarioPortal.do`,{
        headers:{
            Cookie: `${cookies[0]};${cookies[1]}`,
        }
    })

    if(!response){
        return false
    }
    const horariosPage = response.data

    const ewBase = getStringBetween(horariosPage, "EW.loadController(", ",")
    const ewId = getStringBetween(horariosPage, "turmasQuadroDeHorario', ", ")")

    response = await api.get(
        `/quadrodehorarios/EWServlet.ew?EWBase=${ewBase}&EWId=${ewId}&EWAction=loadController&EWHome=turmasQuadroDeHorario`,{
        headers:{
            Cookie: `${cookies[0]};${cookies[1]}`,
        }
    })

    if(!response){
        return false
    }

    return response.data
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

        //const horarioHtmlTable = await getHorariosTable(session)

        return response.status(500).send({message:"Serviço indisponível no momento"})
    }
}