const { Schema, model } = require('mongoose')

const projectSchema = new Schema({
    id: { 
        type: String, 
        required: true, 
        unique: [true, 'El ID de proyecto ya existe'] 
    },
    name: { 
        type: String, 
        required: [true, 'El nombre del proyecto es obligatorio'], 
        minLength: 3,
        maxLenght: 12
    },
    icon: { 
        type: Buffer
    },
    purpose: { 
        type: String, 
        required: [true, 'El fin del proyecto es obligatorio'], 
        enum: {
            values: ['economic', 'non-economic'],
            message: 'No existe el fin "{VALUE}"'
        }
    },
    topic: { 
        type: String, 
        required: [true, 'El tema del proyecto es obligatorio'], 
        minLength: [5, 'El tema del proyecto ocupar 10 caracteres']
    },
    domain: { 
        type: String, 
        required: [true, 'El dominio es obligatorio'], 
        match: [/^[\w.-]+(?:\.[\w\.-]+)+$/, 'Dominio no válido']
    },
    has_tools: {
        contents: {
            type: Boolean, 
            required: true,
        },
        forms: {
            type: Boolean, 
            required: true,
        },
        soon: {
            type: Boolean, 
            required: true,
        }
    },
    head_user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'El responsable de proyecto es obligatorio']
    },
    partner_users: [{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }]
})

exports.Project = model('Project', projectSchema)