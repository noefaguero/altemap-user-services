const Accreditation = require('../database/models/accreditationModel')

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