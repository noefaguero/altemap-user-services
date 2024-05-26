const express = require('express')
const mongoose = require('mongoose')
const { getPass } = require('./src/middlewares')
 
// CONEXION MONGODB
mongoose.connect(process.env.STRING_DB)
    .then(() => console.log('Conexión con MongoDB'))
    .catch(err => console.error(err))

// INICIAR SERVIDOR
const app = express()

// SERVIR RUTAS
// ruta de ingreso
app.post('/login', require('./src/controllers/userControllers').login)
// rutas protegidas por token en gateway
app.use(getPass)
app.use('/users', require('./src/routes/routes'))

// ESCUCHAR CONEXIONES
const PORT = process.env.GATEWAY_URL.split(':')[1]
app.listen(
    PORT, 
    () => console.log(`USER-SERVICE en el puerto ${PORT}`)
)