const accreditationServices = require('../services/accreditationServices')

// HANDLERS
const getAccreditation = async (project_id) => {
	try {
		return await accreditationServices.getAccreditation(project_id)
	} catch (error) {
		console.error('Error al cambiar de espacio de trabajo:', error)
		throw error
	}
}

module.exports = {
	getAccreditation
}