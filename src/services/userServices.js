const User = require('../database/models/userModel')

const { transaction } = require('../utils')
const startSession = require('mongoose').startSession

exports.login = async (email, password) => {
    // buscar usuario
    const doc = await User.findOne({ email: email.toLowerCase(), password: password }, '_id role name last_name avatar').lean()
    doc._id = doc._id.toHexString()
    
    return doc
}

exports.getUserByEmail = async (id) => {
    const doc = await User.findById(id, '_id name last_name email avatar').lean()
    doc._id = doc._id.toHexString()
    
    return doc
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






