const userServices = require('../services/userServices')

// USE CASES
const getUserById = async (id) => {
	try {
		return await userServices.getUserById(id)
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