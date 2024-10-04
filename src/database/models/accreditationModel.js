const { Schema, model, SchemaTypes } = require('mongoose')


const accreditationSchema = new Schema({
    user_id: { 
        type: SchemaTypes.ObjectId, 
        ref: 'User', 
        required: true
    },
    project_id: {
        type: SchemaTypes.ObjectId, 
        ref: 'Project',
        required: true 
    },
    user_fullname: {
        type: SchemaTypes.String,
        required: true 
    },
    project_name: {
        type: SchemaTypes.String,
        required: true 
    },
    permission: { 
        type: SchemaTypes.Map, // JSON variable segun las tools asociadas al proyecto
        required: true,
        validate: {
            validator: (value) => {
                    let result = true
                    value.forEach(item => {
                        if (!['head', 'none', 'read', 'write'].includes(item)) {
                            result = false
                        }
                    })
                    return result
                },
            message: props => 'Los permisos introducidos no son validos'
        }
    }
}, {
    timestamps: true // createdAt y updatedAt
})

const Accreditation = model('Accreditation', accreditationSchema)

module.exports = Accreditation