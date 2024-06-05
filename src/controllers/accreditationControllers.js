const accreditationServices = require('../services/accreditationServices')
const { createToken } = require('../utils')

exports.getAccreditation = async (req, res) => {
  //  cambiar entre proyectos
  const user = req.get('X-User')
  const project = req.params.project_id

  const acc = await accreditationServices.getAccreditation(project, user)
  const dataToken = {
    user_id: user,
    role: req.get('X-Role'),
    project_id: project,
    head: acc.head,
    tools: acc.tools,
  }
console.log(dataToken)
  // crear token con permisos
  const token = createToken(dataToken)
  console.log(token)
  res.json({ token: token })
}