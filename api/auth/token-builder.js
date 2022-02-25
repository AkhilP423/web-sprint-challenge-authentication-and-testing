const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets/secrets.js')

//changed location of secret file, previous repo was bugged and could not export. (or it was on my end...)

function tokenBuilder(user) {
  const payload = {
    subject: user.user_id,
    username: user.username,
  }

  const options = {
    expiresIn: '1d',
  }

  const token = jwt.sign(payload, JWT_SECRET, options)

  return token
  
}

module.exports = tokenBuilder