const accreditationServices = require('../services/accreditationServices')
const { generateToken } = require('../utils/helpers')
const jwt = require('jsonwebtoken')

// Crear token access con permisos de otro proyecto
const changeWorkspace = async (req, res) => {
	try {
		const acc = await accreditationServices.getAccreditation(req.params.id)
		const decode = jwt.decode(req.body.old_token, process.env.JWT_SECRET)

		// crear token con permisos
		const payload = {
			user: decode.user,
			role: decode.role,
			project: acc.project_id.toHexString(),
			permission: acc.permission
		}

		const token = generateToken(payload, parseInt(decode.exp))
		res.json({ token, current_acc: acc })
		
	} catch (error) {
		console.error('Error al cambiar de espacio de trabajo:', error)
		res.status(500).json({ error: 'Error al cambiar de espacio de trabajo' })
	}
}

module.exports = {
	changeWorkspace
}