const Accreditation = require('../database/models/accreditationModel')

exports.getAllAccreditations = async (user_id) => {
    // buscar acreditaciones de un usuario
    return await Accreditation.find(({ user_id: user_id }).exec())
}

exports.getOneAccreditation = async (user_id, project_id) => {
    // buscar acreditacion
    return await Accreditation.findOne(({ project_id: project_id, user_id: user_id }).exec())
}

exports.createAccreditation = async (accreditation) => {
    return await Accreditation.create({ accreditation })
}
