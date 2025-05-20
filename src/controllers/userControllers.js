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

// CONTROLLERS

// Autenticación
// accessToken (usuario y rol en payload, proyecto y permisos)
// refreshToken si el usuario selecciona "mantener sesión" (usuario y rol en payload)
const userLogin = async (req, res) => {
	try {
		const { email, password, keep } = req.body

		// comprobar credenciales
		const user = await userServices.userLogin(email, password)
		if (!user) {
			res.status(401).json({ error: 'El correo electrónico o la contraseña no coinciden.' })
		}

		// crear sesion
		const { createSession } = require('../controllers/sessionControllers')
		const session = await createSession(user, keep, res)
		if (!session) {
			res.status(500).json({ error: 'Error al iniciar sesión.' })
		}
		res.json(session)
		
	} catch (error) {
		console.error('Error al iniciar sesión:', error)
		res.status(500).json({ error: 'Error al iniciar sesión.' })
	}
}


module.exports = {
	userLogin,
	getUserById
}