const userServices = require('../services/userServices')

// HANDLERS
const getUserById = async (id) => {
	try {
		const user = await userServices.getUserById(id)
		return user
	} catch (error) {
		console.error('Error al obtener el usuario:', error)
		return null
	}
}

const userLogin = async (email, password) => {
	try {
		return await userServices.userLogin(email, password)
	} catch (error) {
		console.error('Error al iniciar sesión:', error)
		throw error
	}
}


module.exports = {
	userLogin,
	getUserById
}