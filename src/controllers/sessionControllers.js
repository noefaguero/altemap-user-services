const sessionServices = require('../services/sessionServices')
const userControllers = require('./userControllers')
const accreditationControllers = require('./accreditationControllers')
const { generateToken } = require('../utils/helpers')
const { SECURE_COOKIE } = require('../utils/constants')
const jwt = require('jsonwebtoken')

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
            res.status(400).json({ error: 'Se requiere email y password' })
        }

        // comprobar credenciales
        const user = await userControllers.userLogin(email, password)
        if (!user) {
            res.status(401).json({ error: 'El correo electrónico o la contraseña no coinciden.' })
        }

        // crear sesion
        const { createSession } = require('../controllers/sessionControllers')
        const session = await createSession(user, keep, res)
        if (!session) {
            res.status(500).json({ error: 'Error al iniciar sesión.' })
        }
        res.json(session)
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        res.status(500).json({ error: 'Error al iniciar sesión.' })
    }
}


// Generar token de acceso a partir de refresh token
const refreshSession = async (req, res) => {
    try {
        const refreshToken = req.body.refresh_token
        const payload = req.body.payload
        const exp = req.body.exp
        
        // validación
        if (!refreshToken || !payload || !exp) {
            res.status(400).json({ error: 'Se requiere refresh_token, payload y exp' })
        }
        
        if (!payload.user || !payload.role) {
            res.status(400).json({ error: 'El payload debe contener user y role' })
        }

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
        await sessionServices.rotateRefreshToken(refreshToken, newRefreshToken)

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

// Crear token access con permisos de otro proyecto
const switchWorkspace = async (req, res) => {
    try {
        const accId = req.body.acc_id
        const accessToken = req.cookies.access_token
        
        // validación
        if (!accId || !accessToken) {
            res.status(400).json({ error: 'Se requiere acc_id y access_token' })
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
        res.status(500).json({ error: 'Error al cambiar de espacio de trabajo' })
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token

        if (!refreshToken) {
            res.status(400).json({ error: "Refresh token requerido" })
        }

        // revocar refresh token en la base de datos
        await sessionServices.deleteSession(refreshToken)
        
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
    switchWorkspace,
    logout
}
