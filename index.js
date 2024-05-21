const express = require('express')
const mongoose = require('mongoose')
const routes = require('./src/routes/routes')
const { logIn } = require('./src/controllers/userControllers')

// CONEXION MONGODB
mongoose.connect(process.env.STRING_DB)
    .then(() => console.log('Conexión con MongoDB'))
    .catch(err => console.error(err))

// INICIAR SERVIDOR
const app = express()

// ruta de ingreso
app.post('/login', logIn)
// rutas protegidas por token en gateway
app.use('/users', routes)

// ESCUCHAR CONEXIONES
const PORT = process.env.GATEWAY_URL.split(':')[1]
app.listen(
    PORT, 
    () => console.log(`USER-SERVICE en el puerto ${PORT}`)
)