const accreditationServices = require('../services/accreditationServices')
const { createToken } = require('../utils')
const jwt = require('jsonwebtoken')

const updateToken = async (req, res) => {
  const acc = await accreditationServices.getAccreditation(req.params.id)
  const decode = jwt.decode(req.body.old_token, process.env.JWT_SECRET)
  // crear token con permisos
  const payload = {
    user_id: req.get('X-User'),
    role: req.get('X-Role'),
    project_id: acc.project_id._id,
    permission: acc.permission
  }
  const token = createToken(payload, parseInt(decode.exp))

  res.json({ token, obj_acc: acc })
}

module.exports = {
  updateToken
}