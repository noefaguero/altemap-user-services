const User = require('../database/models/userModel')

const { transaction } = require('../utils')
const startSession = require('mongoose').startSession

exports.login = async (email, password) => {
    // buscar usuario
    return await User.findOne({ email: email.toLowerCase(), password: password }, 'id role name last_name avatar').exec()
}

exports.saveToken = async (user_id, token) => {
    return await User.findOneAndUpdate({ id: user_id }, {token: token})
}

exports.getUserByEmail = async (email) => {
    return await User.findOne({ email: email }, 'id name last_name').exec()
}

exports.logout = async (user_id) => {
    return await User.findOneAndUpdate({ id: user_id }, { token: "" })
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






