const userServices = require('../services/userServices')
const { createToken } = require('../utils')

//LOGIN
const userLogin = async (req, res) => {
  const { email, password, keep } = req.body

  // comprobar credenciales
  const user = await userServices.userLogin(email, password)
  if (!user) {
    res.json({ error: 'Revisa usuario y contraseña' })
    return
  }

  // crear token
  const exp = keep
    ? Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // una semana
    : Math.floor(Date.now() / 1000) * 24 * 60 * 60 // un dia

  const payload = { 
    user_id: user._id, 
    role: user.role 
  }
  const token = createToken(payload, exp)
  
  res.json({ 
    ...user,
    token: token
  })
}


const getUserById = async (req, res) => {
    const user = await userServices.getUserById(req.get('X-User'))
    res.json(user)
}

module.exports = {
    userLogin,
    getUserById
}