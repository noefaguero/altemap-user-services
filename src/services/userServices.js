const User = require('../database/models/userModel')
const { transaction } = require('../utils')
const startSession = require('mongoose').startSession

exports.logIn = async (email, password) => {
    // buscar usuario
    return await User.findOne({ email: email.toLowerCase(), password: password }, 'id role').exec()
}

exports.getUserByEmail = async (email) => {
    return await User.findOne(({ email: email }, 'id name last_name').exec())
}

exports.logOut = async (user_id) => {
    return await Accreditation.findByIdAndUpdate(user_id, { token: "" }).exec()
}

/* exports.transactionExample = async (user) => {
    const response = await transaction(startSession, [
        () => ,
        () => 
    ])
    return response
} */

/* exports.addPartner = async (user) => {
    ENVIAR MAIL
} */






