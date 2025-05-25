// Extrae información de los headers
exports.passLogger = () => {
    return (req, res, next) => {
        req.user = req.headers['x-user']
        req.permission = req.headers['x-permission']
        req.role = req.headers['x-role']
        req.project = req.headers['x-project']
        next()
    }
}

// Imprime la petición, solo en modo desarrollo
exports.reqLogger = () => {
    return (req, res, next) => {
        if (process.env.NODE_ENV !== 'development') {
            return next()
        }
        console.log(`REQUEST: ${req.method} ${req.protocol}://${req.get('Host')}${req.originalUrl}`)
        if (req.body) {
            console.log(`body: ${JSON.stringify(req.body)}`)
        }
        next()
    }
}