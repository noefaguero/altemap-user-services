const userServices = require('../services/userServices')
const sessionControllers = require('../controllers/sessionControllers')

// LOGIN
// accessToken (usuario y rol en payload, mas proyecto y permisos si solo lo hay uno)
// refreshToken si el usuario selecciona "mantener sesión" (usuario y rol en payload)
const userLogin = async (req, res) => {
	const { email, password, keep } = req.body
	// comprobar credenciales
	const user = await userServices.userLogin(email, password)
	if (!user) {
		res.status(401).json({ error: 'El correo electrónico o la contraseña no coinciden.' })
	}

	// crear sesion
	const session = await sessionControllers.createSession(user, keep)
	if (!session) {
		res.status(500).json({ error: 'Error al iniciar sesión.' })
	}
	res.json(session)
}

const getUserById = async (req, res) => {
	const user = await userServices.getUserById(req.get('X-User'))
	res.json(user)
}

module.exports = {
	userLogin,
	getUserById
}