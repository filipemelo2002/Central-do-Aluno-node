const { getTurmaId } = require('../utils/SessionsHandler')

module.exports = {
  async handleParameters (req, res, next) {
    const { cookies } = req

    const { boletimId, ano } = req.query
    if (!boletimId || !ano) {
      return res.status(400).json({
        message: 'Missing parameters'
      })
    }

    const infoBoletin = await getTurmaId(cookies, boletimId)
    const { id_turma } = infoBoletin
    if (!id_turma) {
      return res.status(400).json({
        message: 'Error getting data'
      })
    }
    req.id_turma = id_turma
    next()
  }
}
