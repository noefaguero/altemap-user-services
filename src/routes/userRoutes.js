const router = require('express').Router()
const { logout } = require('../controllers/userControllers')

// el endpoint login se sirve en index.js
router.post('/logout', logout)
// router.all('/head', ) // gestion de autorizaciones como responsable de proyecto

module.exports = router