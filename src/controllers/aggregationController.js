const { getUserById } = require('../services/userServices')
const { getAccreditationsByUser } = require('../services/accreditationServices')

const aggregate = async (req, res) => {
    const userDoc = getUserById(req.get('X-User'))
    const accreditationsDoc = getAccreditationsByUser(req.get('X-User'))

    const [user, accreditations] = await Promise.all([userDoc, accreditationsDoc]);

    return { user, accreditations }
}

module.exports = aggregate