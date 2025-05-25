const sessionServices = require('../services/sessionServices')
const userControllers = require('./userControllers')
const accreditationControllers = require('./accreditationControllers')
const { generateToken } = require('../utils/helpers')
const { SECURE_COOKIE } = require('../utils/constants')
const jwt = require('jsonwebtoken')

const getCookie = (cookies, name) => {
    if (!cookies) return
    return cookies.split(';').find(row => row.startsWith(name))?.substring(name.length + 1)
}
// USE CASES
const createTokens = (user, role, project, permission, keep, exp = null) => {
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
        throw error
    }
}


const createSession = async (user, defaultAcc, keep, res) => {
    try {
        const { accessToken, refreshToken } = createTokens(
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

        if (refreshToken) {
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: SECURE_COOKIE,
                sameSite: 'strict',
                maxAge: 90 * 24 * 60 * 60 * 1000 // 90 dias
            })
        }
        
    } catch (error) {
        console.error('Error al crear la sesión:', error)
        throw error
    }
}

// Generar token de acceso a partir de refresh token
const refreshSession = async (oldRefreshToken, exp, newAccessToken, newRefreshToken, res) => {
    try {
        
        // rotar refresh token en la base de datos
        await sessionServices.rotateRefreshToken(oldRefreshToken, newRefreshToken)

        // tiempo restante hasta la expiración del refresh token
        const currentTime = Math.floor(Date.now() / 1000) // segundos
        const remainingTime = exp - currentTime

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: SECURE_COOKIE,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hora
        })

        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: SECURE_COOKIE,
            sameSite: 'strict',
            maxAge: remainingTime * 1000 // expiración del token original (ms)
        })

    } catch (error) {
        console.error('Error al rotar el refresh token:', error);
        throw error
    }
}

// CONTROLLERS

// Autenticación
// accessToken (usuario y rol en payload, proyecto y permisos)
// refreshToken si el usuario selecciona "mantener sesión" (usuario y rol en payload)
const login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const keep = req.body.keep
        
        // validación
        if (!email || !password) {
            return res.status(400).json({ error: 'Se requiere email y password' })
        }

        // comprobar credenciales
        const user = await userControllers.userLogin(email, password)
        if (!user || Object.keys(user).length === 0) {
            return res.status(401).json({ error: 'El correo electrónico o la contraseña no coinciden.' })
        }

        // acceso por defecto al primer proyecto
        const defaultAcc = user.accreditations[0]

        await createSession(user, defaultAcc, keep, res)
            
        res.json({
            ...user,
            current_acc: defaultAcc
        })
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        throw error
    }
}

// Recuperar session por access token o solo refresh token
const recoverSession = async (req, res) => {
    try {
        const accessToken = getCookie(req.headers.cookie, 'access_token')
        const refreshToken = getCookie(req.headers.cookie, 'refresh_token')

        // validación
        if (!refreshToken && !accessToken) {
            return res.status(400).json({ error: 'Se requiere access_token o refresh_token' })
        }
        
        // recupera la informacion del usuario
        const user = await userControllers.getUserById(req.user)
        if (!user || Object.keys(user).length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // acceso por defecto al primer proyecto
        const defaultAcc = user.accreditations[0]

        // casos de uso
        let exp
        if (refreshToken && !accessToken) {
            // 1. solo refresh token: requiere refrescar la sesión
            // consultar expiración del refresh token
            const session = await sessionServices.getSessionByRefreshToken(refreshToken)
            if (!session) {
                return res.status(401).json({ error: 'REFRESH TOKEN EXPIRADO' })
            }
            exp = session.expires_at.getTime()
            
            // renovar tokens
            const { 
                accessToken: newAccessToken, 
                refreshToken: newRefreshToken 
            } = createTokens(
                req.user,
                req.role,
                defaultAcc.project_id.toHexString(),
                defaultAcc.permission,
                true,
                exp
            )

            // refrescar la sesión
            await refreshSession(refreshToken, exp, newAccessToken, newRefreshToken, res)
        }
        // 2. si existe access token válido: se envían directamente los datos de sesión
        
        res.json({ 
            ...user,
            current_acc: defaultAcc
        })

    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
    }
}


// Crear token access con permisos de otro proyecto
const switchWorkspace = async (req, res) => {
    try {
        const accId = req.body.acc_id
        const accessToken = getCookie(req.headers.cookie, 'access_token')
        
        // validación
        if (!accId || !accessToken) {
            return res.status(400).json({ error: 'Se requiere acc_id y access_token' })
        }
        
        const acc = await accreditationControllers.getAccreditation(project_id)
        const decode = jwt.decode(accessToken, process.env.JWT_SECRET)

        // crear token con permisos
        const payload = {
            user: decode.user,
            role: decode.role,
            project: acc.project_id.toHexString(),
            permission: acc.permission
        }

        const newAccessToken = generateToken(payload, parseInt(decode.exp))

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: SECURE_COOKIE,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hora
        })

        res.json({ current_acc: acc })
        
    } catch (error) {
        console.error('Error al cambiar de espacio de trabajo:', error)
        res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = getCookie(req.headers.cookie, 'refresh_token')

        if (refreshToken) {
            // revocar refresh token en la base de datos
            await sessionServices.deleteSession(refreshToken)
        }

        // eliminar las cookies en el navegador
        res.clearCookie('refresh_token')
        res.clearCookie('access_token')

        res.json({ message: "Sesión cerrada correctamente" })

    } catch (error) {
        console.error('Error al cerrar sesión:', error)
        res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
    }
}

module.exports = {
    login,
    recoverSession,
    switchWorkspace,
    logout
}
