const Project = require('../database/models/projectModel')

// al levantar el servidor y ante evento de nuevo proyecto
const getDomains = async () => {
    return await Project.find({}, 'domain dev_domain').lean()
}

const getProjectById = async (id) => {
    return await Project.findById(id).lean()
}

module.exports = {
    getDomains,
    getProjectById
}