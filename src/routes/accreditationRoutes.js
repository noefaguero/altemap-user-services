const router = require('express').Router()
const { updateToken } = require('../controllers/accreditationControllers')

router.put('/token/:id', updateToken)

// to do: gestion de autorizaciones por responsable de proyecto

module.exports = router