const jwt = require('jsonwebtoken')
const accreditationServices = require('../services/accreditationServices')

exports.getAllAccreditations = async ({ id_user }, res) => {
    // obtener todas las autorizacion al inicio de sesion
    const accreditations = await accreditationServices.getAllAccreditations(id_user)
    res.json(accreditations)
}

exports.getOneAcreditation = async ({ role, id_user, id_proyect}, res) => {
  //  cambiar entre proyectos
  const accreditation = await accreditationServices.getAccreditation(id_user, id_proyect)
  res.json(response)
  // ocultar acreditacion en el token
  const payload = { role: role, accreditation: accreditation }
  
  const token = jwt.sign(
    payload, process.env.JWT_SECRET, 
    // caduca en 1 semana
    { expiresIn: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60}
  )
  res.json(token)
}
