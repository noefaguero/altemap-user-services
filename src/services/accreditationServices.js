const Accreditation = require('../database/models/accreditationModel')

const getPotentialAccreditations = async (user_id) => {
    // buscar todas las posibles acreditaciones de un usuario
    return await Accreditation.find({ user_id: user_id }).exec()
}

const getAccreditation = async (user_id, project_id) => {
    // obtener una acreditacion
    return await Accreditation.findOne({ project_id: project_id, user_id: user_id }).exec()
}

const createAccreditation = async (accreditation) => {
    return await Accreditation.create({ accreditation })
}

module.exports = {
    getPotentialAccreditations,
    getAccreditation,
    createAccreditation
}