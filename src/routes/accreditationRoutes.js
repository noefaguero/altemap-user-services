const router = require('express').Router()
const { changeWorkspace } = require('../controllers/accreditationControllers')

router.put('/token/:id', changeWorkspace)

// to-do: gestion de autorizaciones por responsable de proyecto

module.exports = router