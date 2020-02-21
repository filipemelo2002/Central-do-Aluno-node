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
var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
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

function getHorarioAsJson(htmlTable){
    const table =  getStringBetween(htmlTable, '<div class="TabelaHorarios">', '</div>')
    const tableBody = getStringBetween(table, '<tbody>', '</tbody>')
    const tableColumns = getFromBetween.get(tableBody, '<tr class', '</tr>')

    const tableRows  = []

    tableColumns.forEach(element => {
        tableRows.push(
            getFromBetween.get(element,  '<td>', '</td>')
        )
    });
    if(tableRows[0]){
        const week = ['seg','ter','quar','quin', 'sext', 'sab', 'domi']
        const response = []
        
        response.push({
            seg: "Seg",
            ter: "Terç",
            quar: "Qua",
            quin: "Qui",
            sext: "Sex",
            sab: "Sáb",
            domi: "Dom",
        })
        
        for(let i=0; i< tableRows.length; i++){
            const row = {}
            for(let j=0; j < tableRows[i].length; j++){
                row[week[j]] =  tableRows[i][j]
            }
            response.push(row)
        }
        return response
    }
    return false
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

        const horarioHtmlTable = await getHorariosTable(session)
        const horario = getHorarioAsJson(horarioHtmlTable)
        return response.json(horario)
    }
}