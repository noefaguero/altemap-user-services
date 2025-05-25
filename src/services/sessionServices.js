const Session = require('../database/models/sessionModel')

const createSession = async (data) => {
    try {
        const newSession = new Session(data)
        return await newSession.save()

    } catch (error) {
        throw error
    }
}

// comprobar si el token existe y no ha expirado
// devuelve objeto de session
const validateToken = async (oldToken) => {
    try {
        const session = await Session.findOne({ refresh_token: oldToken, expires_at: { $gt: Date.now() } }).lean()
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
            { refresh_token: newToken, last_rotated_at: Date.now() },
        )
        return result
    } catch {
        throw error
    }
}

const deleteSession = async (refreshToken) => {
    try {
        // revocar el token
        const result = await Session.deleteOne({ refresh_token: refreshToken })
        return result
    } catch (error) {
        throw error
    }
}

const getSessionByRefreshToken = async (refreshToken) => {
    try {
        const session = await Session.findOne({ refresh_token: refreshToken }).lean()
        return session
    } catch (error) {
        throw error
    }
}


module.exports = {
    validateToken,
    createSession,
    rotateRefreshToken,
    deleteSession
}