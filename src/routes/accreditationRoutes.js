const router = require('express').Router()
const { getAcreditation } = require('./controllers/accreditationControllers')

router.get('/:project', getAcreditation)

module.exports = router