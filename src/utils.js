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

exports.createToken = (payload) => {
  
  const token = jwt.sign(
    // ocultar info de session o de acreditacion en el token
    payload, 
    process.env.JWT_SECRET, 
    // caduca en 1 semana
    { expiresIn: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 }
  )

  return token
}