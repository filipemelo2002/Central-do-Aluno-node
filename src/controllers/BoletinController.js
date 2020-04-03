'use strict'

const { getBoletinData } = require('../utils/SessionsHandler')
const api = require('../utils/api')

async function getBoletinsPage (cookies) {
  const response = await api.get(
    '/WebModuleBoletim/interfaceBoletimAction.do?actionType=exibirImplementacao&idAtor=1', {
      headers: {
        Cookie: `${cookies[0]};${cookies[1]}`
      }
    })

  if (!response) {
    return false
  }
  return response.data
}
function sanitizeBoletimData (boletimGrid) {
  const withoutTags = boletimGrid.replace(/(\r\n|\n|\r|\t)/gm, '').replace(/ul id="[^"][^>]*>?/gm, '')
  const labels = withoutTags.split(/<[^>]*>?/gm).map(line => line.trim())

  const content = boletimGrid.match(/((?=\()(.*?)(?=\)))/gm)

  const sanitizedLabels = labels.filter(function (el) {
    return el !== ''
  })

  const response = []
  for (let i = 0; i < sanitizedLabels.length; i++) {
    response[i] = {
      label: sanitizedLabels[i],
      boletimId: parseInt(content[i].split(',')[0].replace(/\('/g, '').replace(/'/g, '')),
      ano: parseInt(content[i].split(',')[1].replace(/'/g, ''))
    }
  }

  return response
}
function sanitizeBoletinData (boletinData) {
  const boletin = []
  const materias = boletinData.filter(materia => materia.indice === undefined)
  materias.forEach(materia => {
    const nota_p1 = materia.nota_p1 ? materia.nota_p1 : materia.conceito_p1 ? materia.conceito_p1 : '-'
    const nota_p2 = materia.nota_p2 ? materia.nota_p2 : materia.conceito_p2 ? materia.conceito_p2 : '-'
    const nota_p3 = materia.nota_p3 ? materia.nota_p3 : materia.conceito_p3 ? materia.conceito_p3 : '-'
    const nota_p4 = materia.nota_p4 ? materia.nota_p4 : materia.conceito_p4 ? materia.conceito_p4 : '-'
    const nota_rf = materia.nota_rf ? materia.nota_rf : materia.conceito_rf ? materia.conceito_rf : '-'
    const nota_rec = materia.nota_rec ? materia.nota_rec : materia.conceito_rec ? materia.conceito_rec : '-'

    boletin.push({
      materia: materia.descricao,
      nota_p1,
      nota_p2,
      nota_p3,
      nota_p4,
      nota_rf,
      nota_rec
    })
  })

  return boletin
}
module.exports = {
  async index (request, response) {
    const { cookies } = request
    const boletinPage = await getBoletinsPage(cookies)
    const boletimGrid = boletinPage.substring(
      boletinPage.lastIndexOf('<ul id="divBoletim_') + 1,
      boletinPage.lastIndexOf('</ul>')
    )
    const boletins = sanitizeBoletimData(boletimGrid)
    return response.json(boletins)
  },

  async show (request, response) {
    const { cookies } = request
    const { id_turma } = request
    const { boletimId, ano } = request.query

    const boletinData = await getBoletinData(cookies, boletimId, id_turma, ano)
    const boletin = sanitizeBoletinData(boletinData)

    return response.json({ data: boletin })
  }
}
