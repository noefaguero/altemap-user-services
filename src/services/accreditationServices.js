const Accreditation = require('../database/models/accreditationModel')

/* const getAccreditationsByUser = async (userId) => {
    // buscar todas las acreditaciones de un usuario
    const docs = await Accreditation.find({ user_id: userId }, '_id project_name project_id').lean()
    return docs.map(doc => {
        doc._id = doc._id.toHexString()
        doc.project_id = doc.project_id.toHexString()
        return doc
    })
} */

const getAccreditation = async (id) => {
    // obtener una acreditacion para crear token de permisos (al iniciar y al cambiar entre proyectos)
    return await Accreditation.findById(id).lean()
}

const createAccreditation = async (accreditation) => {
    return await Accreditation.create({ accreditation })
}

module.exports = {
    getAccreditation,
    createAccreditation
}