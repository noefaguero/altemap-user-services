const router = require('express').Router()
const { getAllAcreditations, getOneAcreditation } = require('./controllers/accreditationControllers')

router.get('/', getOneAcreditation)
router.get('/all', getAllAcreditations)

module.exports = router