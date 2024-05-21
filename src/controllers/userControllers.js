const userServices = require('../services/userServices')

//LOGIN
exports.logIn = async ({ email, password }, res) => {
  // comprobar credenciales
  const user = await userServices.loginController(email, password)
  if (!user) {
    res.status(400).json({ msg: 'Revisa usuario y contraseña' })
  }
}
// LOGOUT
exports.logOut = async ({ id_user }, res) => {
  const response = await userServices.logOut(id_user)
  res.json(response)
}