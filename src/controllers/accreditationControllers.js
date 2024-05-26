const jwt = require('jsonwebtoken')
const accreditationServices = require('../services/accreditationServices')

exports.getPotentialAccreditations = async (user_id) => {
    // obtener proyectos asociados a un usuario, al inicio de sesion
    return await accreditationServices.getPotentialAccreditations(user_id)  
}

exports.getAccreditation = async ({ pass, params }, res) => {
  //  cambiar entre proyectos
  const response = await accreditationServices.getAccreditation(pass.user_id, params.project_id)
  const accreditation = await response.json()
  // ocultar acreditacion en el token
  const payload = { role: role, ...accreditation }
  
  const token = jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    // caduca en 1 semana
    { expiresIn: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60}
  )
  res.json(token)
}
