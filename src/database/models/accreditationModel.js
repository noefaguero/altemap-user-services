const { Schema, model, SchemaTypes } = require('mongoose')

// subdocumento
const toolPermissionsSchema = new Schema({
    tool_name: {
        type: String,
        enum: {
            values: ['contents', 'forms', 'soon'],
            message: 'No existe la herramienta "{VALUE}"'
        }
    },
    permission: {
        type: String,
        enum: {
            values: ['none', 'read', 'write'],
            message: 'No existe el permiso de tipo "{VALUE}"'
        }
    }
}, { _id: false })

const accreditationSchema = new Schema({
    user_id: { 
        type: SchemaTypes.ObjectId, 
        ref: 'User', 
        required: true
    },
    head: {
        type: Boolean,
        required: true,
    },
    project_id: {
        type: SchemaTypes.ObjectId, 
        ref: 'Project',
        required: true 
    },
    user_fullname: {
        type: String,
        required: true,
    },
    project_name: {
        type: String,
        required: true,
    },
    tools: [
        toolPermissionsSchema
    ]
}, {
    timestamps: true // createdAt y updatedAt
})

const Accreditation = model('Accreditation', accreditationSchema)

module.exports = Accreditation