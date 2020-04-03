const { userTokenHandler } = require('../utils/SessionsHandler')
module.exports = {
  async authUser (req, res, next) {
    const { usertoken } = req.headers

    if (!usertoken) return res.status(400).json({ message: 'missing parameters' })

    const cookies = await userTokenHandler(usertoken)

    if (!cookies) return res.status(400).json({ message: 'User not authorized' })
    req.cookies = cookies
    next()
  }
}
