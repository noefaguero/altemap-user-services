const router = require('express').Router()
const { getAccreditation } = require('../controllers/accreditationControllers')

router.get('/:id', getAccreditation)
// to do: gestion de autorizaciones por responsable de proyecto

module.exports = router