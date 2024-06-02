const Accreditation = require('../database/models/accreditationModel')

const getAccreditationsByUser = async (userId) => {
    // buscar todas las acreditaciones de un usuario
    return await Accreditation.find({ user_id: userId }, 'head _id project_name').lean()
}

const getAccreditation = async (id) => {
    // obtener una acreditacion para crear token de permisos
    return await Accreditation.findOne({ _id: id }, 'head user_id project_id tools').lean()
}

const createAccreditation = async (accreditation) => {
    return await Accreditation.create({ accreditation })
}

module.exports = {
    getAccreditationsByUser,
    getAccreditation,
    createAccreditation
}