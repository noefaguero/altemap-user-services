const express = require('express')
const mongoose = require('mongoose')
const { USER_HOST } = process.env
 
// CONEXION MONGODB
mongoose.connect(process.env.USERS_DB).catch(error => console.error(error))

// INICIAR SERVIDOR
const app = express()

app.use(express.json())

// SERVIR RUTAS
app.use('/', require('./routes'))

// ESCUCHAR CONEXIONES
const PORT = USER_HOST.split(':')[2]
app.listen(PORT, () => console.log(`\n\t\x1b[1m%s\x1b[0m \n\t-> Local: ${USER_HOST}\n`, 'USER-SERVICES READY'))