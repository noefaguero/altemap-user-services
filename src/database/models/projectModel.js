const { Schema, model, SchemaTypes } = require('mongoose')


const projectSchema = new Schema({
    name: { 
        type: SchemaTypes.String, 
        required: [true, 'El nombre del proyecto es obligatorio'], 
        minLength: 3,
        maxLenght: 12
    },
    icon: { 
        type: Buffer
    },
    purpose: { 
        type: SchemaTypes.String, 
        required: [true, 'El objetivo del proyecto es obligatorio'], 
        enum: {
            values: ['economic', 'non-economic'],
            message: props => `No existe el fin ${props.value}`
        }
    },
    topic: { 
        type: SchemaTypes.String, 
        required: [true, 'El tema del proyecto es obligatorio'], 
        minLength: [5, 'El tema del proyecto ocupar 10 caracteres']
    },
    domain: { 
        type: SchemaTypes.String, 
        required: [true, 'El dominio es obligatorio'], 
        match: [/^[\w.-]+(?:\.[\w\.-]+)+$/, 'Dominio no válido']
    },
    tools: {
        contents: { type: SchemaTypes.Boolean, required: true },
        forms: { type: SchemaTypes.Boolean, required: true },
        seo: { type: SchemaTypes.Boolean, required: true } // no desarrollado
    },
    head_user: { 
        type: SchemaTypes.ObjectId, 
        ref: 'User', 
        required: [true, 'El responsable de proyecto es obligatorio']
    },
    // acreditaciones solo de colaboracion
    col_accreditations: [{
        type: SchemaTypes.ObjectId, 
        ref: 'Accreditation'
    }]
}, {
    timestamps: true // createdAt y updatedAt
})

const Project = model('Project', projectSchema)

module.exports = Project