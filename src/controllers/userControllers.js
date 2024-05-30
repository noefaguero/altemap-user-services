const userServices = require('../services/userServices')
const { getPotentialAccreditations} = require('./accreditationControllers')
const {createToken} = require('../utils')

//LOGIN
exports.login = async (req, res) => {
  const { email, password, keep } = req.body

  // comprobar credenciales
  const user = await userServices.login(email, password)
  if (!user) {
    res.json({ error: 'Revisa usuario y contraseña' })
    return
  }

  // acreditaciones posibles
  const accreditations = await getPotentialAccreditations(user.id)
    if (!accreditations) {
      res.json({ error: 'No tienes proyectos activos' })
      return
    }
    console.log(accreditations[0])
    // sacar token para el primer proyecto
    const token = createToken(user.role, accreditations[0].project_id)
    console.log(token)

    const response = await userServices.saveToken(user.id, token)
    if (response) {
      res.json({ user: user, accreditations: accreditations, keep: keep, token: token})
    }
}

// LOGOUT
exports.logout = async ({ pass }, res) => {
  const response = await userServices.logout(pass.user_id)
  res.json(response)
}