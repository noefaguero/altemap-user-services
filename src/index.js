const express = require('express')
const mongoose = require('mongoose')
 
// CONEXION MONGODB
mongoose.connect(process.env.STRING_USERS_DB).catch(error => console.error(error))

// INICIAR SERVIDOR
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SERVIR RUTAS
app.use('/', require('./routes'))

// ESCUCHAR CONEXIONES
const PORT = process.env.USER_URL.split(':')[2]
app.listen(PORT, () => console.log(`\t-> USER-SERVICES en el puerto ${PORT}`))
