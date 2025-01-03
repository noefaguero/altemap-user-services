const { Schema, model, SchemaTypes } = require('mongoose')

const userSchema = new Schema({
    name: {
        type: SchemaTypes.String,
        required: [true, 'Nombre obligatorio'],
        minLength: [3, 'El nombre ser mayor de 3 letras'],
        maxLength: [12, 'El nombre no puede ser menor de 3 letras'],
        match: [/[a-záéíóúüñ]/i, 'El nombre contiene caracteres no permitidos']
    },
    last_name: {
        type: SchemaTypes.String,
        required: false,
        minLength: [3, 'El apellido no puede ser menor de 3 letras'],
        maxLength: [12, 'El apellido no puede ser mayor 12 letras'],
        match: [/[a-záéíóúüñ]/i, 'El apellido contiene caracteres no permitidos']
    },
    email: {
        type: SchemaTypes.String,
        required: [true, 'Email de usuario obligatorio'],
        unique: [true, 'El correo introducido ya existe'],
        match: [
            /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            'Correo electrónico no válido'
        ]
    },
    password: {
        type: SchemaTypes.String,
        required: [true, 'Contraseña de usuario obligatoria']
    },
    role: {
        type: SchemaTypes.String,
        enum: {
            values: ['admin', 'user'],
            message: props => `No existe el rol ${props.value}`
        },
        required: [true, 'Rol de usuario obligatorio']
    },
    avatar: {
        type: SchemaTypes.String, // https://api.altemap.com/avatar/8e4a953b-e810-4267-9c74-38054f44a7f3.jpg
        match: [
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/, 
            'URL no válida'
        ]
    },
    accreditations: [{
        type: SchemaTypes.ObjectId, 
        ref: 'Accreditation'
    }]
}, {
    timestamps: true // createdAt y updatedAt
})

const User = model('User', userSchema)

module.exports = User