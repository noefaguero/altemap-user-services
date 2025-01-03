const User = require('../database/models/userModel')

exports.userLogin = async (email, password) => {
    return await User.findOne({ email: email, password: password }, '-password').populate('accreditations').lean()
}

exports.getUserById = async (id) => {
    return await User.findById(id, '-password').populate('accreditations').lean()
}

/* exports.addPartner = async (user) => {
    ENVIAR MAIL
} */