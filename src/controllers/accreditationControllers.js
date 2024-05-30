const accreditationServices = require('../services/accreditationServices')
const { saveToken } = require('../services/userServices')
const createToken = require('../utils')

exports.getPotentialAccreditations = async (user_id) => {
  // obtener proyectos asociados a un usuario, al inicio de sesion
  return await accreditationServices.getPotentialAccreditations(user_id) 
}

exports.switchAccreditation = async ({ pass, params }, res) => {
  //  cambiar entre proyectos
  const response = await accreditationServices.getAccreditation(pass.user_id, params.project_id)
  if (!response) {
    // manejar error
    return
  }
  
  // sacar token
  const token = createToken(pass.role, accreditation)
  await saveToken(token)

  res.json(accreditation) // para construir header del projecto
}