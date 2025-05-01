const Session = require('../database/models/sessionModel')

const createSession = async (userId, refreshToken, expiresAt) => {
    try {
        const session = new Session({
            user: userId,
            refresh_token: refreshToken,
            expiresAt
        })
        await session.save()
        return session
    } catch (error) {
        throw error
    }
}

// comprobar si el token existe y no ha expirado
// devuelve objeto de session
const validateToken = async (oldToken) => {
    try {
        const session = await Session.findOne({ refresh_token: oldToken, expiresAt: { $gt: Date.now() } })
        return session
    } catch (error) {
        throw error
    }
}

// rotar token
const rotateRefreshToken = async (oldToken, newToken) => {
    try {
        const result = await Session.findOneAndUpdate(
            { refresh_token: oldToken },
            { refresh_token: newToken }
        )
        return result
    } catch {
        throw error
    }
}

const logout = async (refreshToken) => {
    try {
        // revocar el token
        const result = await Session.deleteOne({ refresh_token: refreshToken })
        return result
    } catch (error) {
        throw error
    }
}


module.exports = {
    validateToken,
    createSession,
    rotateRefreshToken,
    logout
}