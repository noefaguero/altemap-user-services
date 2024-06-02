const userServices = require('../services/userServices')
const { getAccreditationsByUser } = require('./accreditationControllers')
const { createToken } = require('../utils')

//LOGIN
exports.login = async (req, res) => {
  const { email, password, keep } = req.body

  // comprobar credenciales
  const user = await userServices.login(email, password)
  if (!user) {
    res.json({ error: 'Revisa usuario y contraseña' })
    return
  }

  // autorizacion
  const accreditations = await getAccreditationsByUser(user._id)
  if (!accreditations) {
    res.json({ error: 'No tienes proyectos activos' })
    return
  }

  // crear token de sesion
  const token = createToken({ id: user._id.toJSON(), role: user.role })
  
  res.json({ 
    user: user, 
    accreditations: accreditations, 
    keep: keep, 
    token: token
  })
}