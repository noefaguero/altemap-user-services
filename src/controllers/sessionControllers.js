const sessionServices = require('../services/sessionServices')
const { generateToken } = require('../utils')
const jwt = require('jsonwebtoken')

// UTILS
const createTokens = async (user, role, project, permission, keep) => {
    const payload = { user, role }

    // refreshToken expira en 90 días
    // datos cifrados: usuario y rol
    let refreshToken = null
    if (keep) {
        const refreshExp = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60 // 90 dias en unix
        refreshToken = generateToken(payload, refreshExp)
    }

    // accessToken expira en 1 hora
    // datos cifrados: usuario, rol, proyecto en uso y permisos
    const accessExp = Math.floor(Date.now() / 1000) + 60 * 60 // 1 hora en unix
    payload.project = project
    payload.permission = permission

    const accessToken = generateToken(payload, accessExp)

    return {
        accessToken,
        refreshToken,
    }
}

// CONTROLLERS
const createSession = async (user, keep) => {
    // acceso por defecto al primer proyecto
    const defaultAcc = user.accreditations[0]

    const { accessToken, refreshToken } = await createTokens(
        user._id.toHexString(),
        user.role,
        defaultAcc.project_id.toHexString(),
        defaultAcc.permission,
        keep
    )

    // guardar sesion en base de datos si la sesión es mantenida
    if (keep) {
        await sessionServices.createSession(
            user._id.toHexString(),
            refreshToken,
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dias de inactividad
        )
    }

    return {
        ...user,
        token: accessToken,
        refresh_token: refreshToken,
        current_acc: defaultAcc
    }
}

const rotateRefreshToken = async (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).json({ error: 'Access token requerido' })
    }
    const accessToken = auth.replace('Bearer ', '')

    // verificar token
    let payload, exp
    jwt.verify(
        accessToken,
        process.env.JWT_SECRET,
        (error, decoded) => {
            if (error) {
                res.status(401).json({ error: 'Access-token inválido o expirado' })
            }
            payload = {
                user: decoded.user,
                role: decoded.role
            }
            exp = decoded.exp
        }
    )

    const newRefreshToken = generateToken(payload, parseInt(exp))

    await sessionServices.rotateRefreshToken(
        payload.user,
        newRefreshToken
    )

    res.json({
        refresh_token: newRefreshToken
    })
}


const logout = async (req, res) => {
    const { refresh_token } = req.body
    if (!refresh_token) {
        return res.status(400).json({ error: "Refresh token requerido" })
    }
    // revocar token
    await sessionServices.revokeToken(refresh_token)
    res.json({ message: "Sesión cerrada correctamente" })
}


module.exports = {
    createSession,
    rotateRefreshToken,
    logout
}
