const router = require('express').Router()
const { logOut } = require('./controllers/userController')

router.post('/logout', logOut)
// router.all('/head', ) // gestion de autorizaciones como responsable de proyecto

module.exports = router