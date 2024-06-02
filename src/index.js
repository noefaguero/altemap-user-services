const express = require('express')
const mongoose = require('mongoose')
const { knowUser } = require('./middlewares')
 
// CONEXION MONGODB
mongoose.connect(process.env.STRING_USERS_DB)
    .then(() => console.log('Conexión con MongoDB'))
    .catch(error => console.error(error))

// INICIAR SERVIDOR
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SERVIR RUTAS
// ruta de ingreso
app.post('/login', require('./controllers/userControllers').login)
// rutas protegidas por token de sesion en gateway
app.use(knowUser())
app.use('/user', require('./routes/routes'))

// ESCUCHAR CONEXIONES
const PORT = process.env.USER_URL.split(':')[2]
app.listen(
    PORT, 
    () => console.log(`USER-SERVICE en el puerto ${PORT}`)
)