const { Schema, model } = require('mongoose')

const accreditationSchema = new Schema({
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    head: {
        type: Boolean,
        required: true,
    },
    project_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Project', 
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
})

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
})

exports.Accreditation = model('Accreditation', accreditationSchema)
