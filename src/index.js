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
const URL = process.env.USER_URL
const PORT = URL.split(':')[2]
app.listen(PORT, () => console.log(`\n\t\x1b[1m%s\x1b[0m \n\t-> Local: ${URL}\n`, 'USER-SERVICES READY'))