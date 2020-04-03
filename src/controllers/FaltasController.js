'use strict'

const { getBoletinData } = require('../utils/SessionsHandler')
const api = require('../utils/api')

async function getPercentFaltas (cookies, boletimId, id_turma, ano) {
  const response = await api.get(
        `/ws/eol/aluno/documentos/BoletimEscolar/percentualFaltas?idAlunoMatricula=${boletimId}&idTurma=${id_turma}&ano=${ano}&isInterface=true&request.preventCache=`, {
          headers: {
            Cookie: `${cookies[0]};${cookies[1]}`
          }
        })

  if (!response) {
    return false
  }
  const { perc1, perc2, perc3, perc4 } = response.data
  return {
    perc1: Number(perc1) ? perc1 : 0,
    perc2: Number(perc2) ? perc2 : 0,
    perc3: Number(perc3) ? perc3 : 0,
    perc4: Number(perc4) ? perc4 : 0
  }
}

function sanitizeFaltasAmount (faltasData) {
  const faltas = []
  const materias = faltasData.filter(materia => materia.indice === undefined)
  materias.forEach(materia => {
    const name = materia.descricao
    const qtd_faltas_p1 = materia.qtd_faltas_p1 ? materia.qtd_faltas_p1 : 0
    const qtd_faltas_p2 = materia.qtd_faltas_p2 ? materia.qtd_faltas_p2 : 0
    const qtd_faltas_p3 = materia.qtd_faltas_p3 ? materia.qtd_faltas_p3 : 0
    const qtd_faltas_p4 = materia.qtd_faltas_p4 ? materia.qtd_faltas_p4 : 0
    const total_faltas = qtd_faltas_p1 + qtd_faltas_p2 + qtd_faltas_p3 + qtd_faltas_p4
    faltas.push({
      materia: name,
      qtd_faltas_p1,
      qtd_faltas_p2,
      qtd_faltas_p3,
      qtd_faltas_p4,
      total_faltas
    })
  })

  const sum_p1 = faltas.reduce((falta, next) => falta + next.qtd_faltas_p1, 0)
  const sum_p2 = faltas.reduce((falta, next) => falta + next.qtd_faltas_p2, 0)
  const sum_p3 = faltas.reduce((falta, next) => falta + next.qtd_faltas_p3, 0)
  const sum_p4 = faltas.reduce((falta, next) => falta + next.qtd_faltas_p4, 0)
  const sum_total = faltas.reduce((falta, next) => falta + next.total_faltas, 0)
  const sumFaltas = {
    sum_p1,
    sum_p2,
    sum_p3,
    sum_p4,
    sum_total
  }
  return sumFaltas
}
module.exports = {
  async index (request, response) {
    const { cookies } = request
    const { id_turma } = request
    const { boletimId, ano } = request.query

    const percent = await getPercentFaltas(cookies, boletimId, id_turma, ano)
    const boletinData = await getBoletinData(cookies, boletimId, id_turma, ano)
    const faltasCount = sanitizeFaltasAmount(boletinData)
    return response.json({ percent, details: faltasCount })
  }
}
