const User = require('../database/models/userModel')

const { transaction } = require('../utils')
const startSession = require('mongoose').startSession

exports.userLogin = async (email, password) => {
    return await User.findOne({ email: email, password: password }, '-password').populate('accreditations').lean()
    /* doc._id = doc._id.toHexString()
    return doc */
}

exports.getUserById = async (id) => {
    return await User.findById(id, '-password').populate('accreditations').lean()
}

/* exports.addPartner = async (user) => {
    ENVIAR MAIL
} */






