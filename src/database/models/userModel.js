const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    id: { 
        type: String, 
        required: [true, , 'ID de usuario obligatorio'],
        unique: [true, 'El ID de usuario ya existe'] 
    },
    name: { 
        type: String, 
        required: [true, 'Nombre obligatorio'],
        minLength: [3, 'El nombre ser mayor de 3 letras'],
        maxLength: [12, 'El nombre no puede ser menor de 3 letras'],
        match: [/[a-záéíóúüñ]/i, 'El nombre contiene caracteres no permitidos']
    },
    last_name: { 
        type: String, 
        required: false,
        minLength: [3, 'El apellido no puede ser menor de 3 letras'],
        maxLength: [12, 'El apellido no puede ser mayor 12 letras'],
        match: [/[a-záéíóúüñ]/i, 'El apellido contienen caracteres no permitidos']
    },
    email: { 
        type: String, 
        required: [true, 'Email de usuario obligatorio'],
        unique: [true, 'El correo ya existe'],
        match: [/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Correo no válido']
    },
    password: { 
        type: String, 
        required: [true, 'Contraseña de usuario obligatoria']
    },
    role: { 
        type: String, 
        enum: {
            values: ['admin', 'user'],
            message: 'No existe el rol "{VALUE}"'
        },
        required: [true, 'Rol de usuario obligatorio']
    },
    token: { 
        type: String
    }
})

exports.User = model('User', userSchema)
