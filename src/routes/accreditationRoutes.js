const router = require('express').Router()
const { switchAccreditation } = require('../controllers/accreditationControllers')

router.get('/:project', switchAccreditation)
// to do: gestion de autorizaciones por responsable de proyecto

module.exports = router