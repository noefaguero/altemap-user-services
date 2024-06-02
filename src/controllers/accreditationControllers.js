const accreditationServices = require('../services/accreditationServices')
const { createToken } = require('../utils')

exports.getAccreditationsByUser = async (user_id) => {
  // obtener proyectos asociados a un usuario, al inicio de sesion
  return await accreditationServices.getAccreditationsByUser(user_id) 
}

exports.getAccreditation = async ({ params }, res) => {
  //  cambiar entre proyectos
  const acc = await accreditationServices.getAccreditation(params.id)
  acc.user_id = acc.user_id.toJSON()
  acc.project_id = acc.project_id.toJSON()
  acc._id = acc._id.toJSON()
  
  // crear token de permisos
  const token = createToken(acc)
  res.json({token: token})
}