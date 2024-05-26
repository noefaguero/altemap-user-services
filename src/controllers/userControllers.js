const userServices = require('../services/userServices')
const { getPotentialAccreditations } = require('./accreditationControllers')

//LOGIN
exports.login = async ({ body }, res) => {
  const { email, password, keep } = body
  // comprobar credenciales
  const user = await userServices.login(email, password)

  if (!user) {
    res.status(400).json({ error: 'Revisa usuario y contraseña' })
  }
  const accreditations = await getPotentialAccreditations(user.id)
  res.json({ accreditations: accreditations, keep: keep })
}

// LOGOUT
exports.logout = async ({ pass }, res) => {
  const response = await userServices.logout(pass.user_id)
  res.json(response)
}