const jwt = require('jsonwebtoken')

exports.createToken = (payload, exp) => {

	const token = jwt.sign(
		payload, // ocultar info de session y acreditacion en el token
		process.env.JWT_SECRET,
		{ expiresIn: exp } // caduca en 1 semana
	)

	return token
}