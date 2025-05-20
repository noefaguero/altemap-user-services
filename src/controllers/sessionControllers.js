const sessionServices = require('../services/sessionServices')
const userControllers = require('./userControllers')
const { generateToken } = require('../utils/helpers')
const { SECURE_COOKIE } = require('../utils/constants')

// HANDLERS
const createTokens = async (user, role, project, permission, keep, exp = null) => {
    try {
        const payload = { user, role }

        // refreshToken expira en 90 días
        // datos cifrados: usuario y rol
        let refreshToken = null
        if (keep) {
            const refreshExp = exp ?? Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60 // 90 dias en unix
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
    } catch (error) {
        console.error('Error al crear los tokens:', error)
        return null
    }
}


const createSession = async (user, keep, res) => {
    try {
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
            const sessionData = {
                user: user._id.toHexString(),
                refresh_token: refreshToken,
                expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias de expiración
                last_rotated_at: new Date(Date.now()) // se permiten 14 dias de inactividad
            }
            
            await sessionServices.createSession(sessionData)
        }

        res.cookie('access_token', accessToken, {
            httpOnly: true, // evita acceder al token desde JavaScript
            secure: SECURE_COOKIE, // boleano para limitar a HTTPS
            sameSite: 'strict', // evita ataques CSRF
            maxAge: 60 * 60 * 1000 // 1 hora
        })

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: SECURE_COOKIE,
            sameSite: 'strict',
            maxAge: 90 * 24 * 60 * 60 * 1000 // 90 dias
        })

        return {
            ...user,
            current_acc: defaultAcc
        }
        
    } catch (error) {
        console.error('Error al crear la sesión:', error)
        return null
    }
}

// CONTROLLERS

// Generar token de acceso a partir de refresh token
const refreshSession = async (req, res) => {
    try {
        const { old_refresh_token, payload, exp } = req.body

        // recupera la informacion del usuario
        const user = await userControllers.getUserById(payload.user)
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // acceso por defecto al primer proyecto
        const defaultAcc = user.accreditations[0]

        const { accessToken, refreshToken: newRefreshToken } = await createTokens(
            payload.user,
            payload.role,
            defaultAcc.project_id.toHexString(),
            defaultAcc.permission,
            true,
            parseInt(exp)
        )

        // rotar el token de refresco en la base de datos
        await sessionServices.rotateRefreshToken(old_refresh_token, newRefreshToken)

        // tiempo restante hasta la expiración del refresh token
        const currentTime = Math.floor(Date.now() / 1000) // segundos
        const remainingTime = exp - currentTime

        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: SECURE_COOKIE,
            sameSite: 'strict',
            maxAge: remainingTime * 1000 // expiración del token original (ms)
        })

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: SECURE_COOKIE,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hora
        })
        
        res.json({ 
            ...user,
            current_acc: defaultAcc
        })

    } catch (error) {
        console.error('Error al rotar el refresh token:', error);
        res.status(500).json({ error: 'Error al rotar el refresh token' })
    }
}


const logout = async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token
        if (!refresh_token) {
            return res.status(400).json({ error: "Refresh token requerido" })
        }

        // revocar refresh token en la base de datos
        await sessionServices.deleteSession(refresh_token)
        
        // eliminar las cookies en el navegador
        res.clearCookie('refresh_token')
        res.clearCookie('access_token')
        
        res.json({ message: "Sesión cerrada correctamente" })

    } catch (error) {
        console.error('Error al cerrar sesión:', error)
        res.status(500).json({ error: 'Error al cerrar sesión' })
    }
}

module.exports = {
    createSession,
    refreshSession,
    logout
}
