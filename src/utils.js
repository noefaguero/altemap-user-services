const jwt = require('jsonwebtoken')

// MUTACIONES EN DOCUMENTOS CON DEPENDENCIA
exports.transaction = async (operations) => {
	const session = await startSession()
	session.startTransaction()

	try {
		operations.forEach(async operation => await operation())
		return true

	} catch (error) {
		await session.abortTransaction()
		return false

	} finally {
		session.endSession()
	}
}

exports.createToken = (payload, exp) => {

	const token = jwt.sign(
		payload, // ocultar info de session o de acreditacion en el token
		process.env.JWT_SECRET,
		{ expiresIn: exp } // caduca en 1 semana
	)

	return token
}