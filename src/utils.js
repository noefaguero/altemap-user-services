const jwt = require('jsonwebtoken')

exports.generateToken = (payload, exp) => {

	const token = jwt.sign(
		payload, // ocultar info de session y acreditacion en el token
		process.env.JWT_SECRET,
		{ expiresIn: exp }
	)

	return token
}