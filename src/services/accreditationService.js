const Accreditation = require('../database/models/accreditationModel')

exports.getPotentialAccreditations = async (user_id) => {
    // buscar acreditaciones de un usuario
    return await Accreditation.find(({ user_id: user_id }, 'project_id, head').exec())
}

exports.getAccreditation = async (user_id, project_id) => {
    // buscar acreditacion
    return await Accreditation.findOne(({ project_id: project_id, user_id: user_id }).exec())
}

exports.createAccreditation = async (accreditation) => {
    return await Accreditation.create({ accreditation })
}
