const router = require('express').Router()
const { login, refreshSession, switchWorkspace, logout } = require('../controllers/sessionControllers')

router.post('/user-services/session', login)
router.put('/user-services/session/refresh', refreshSession)
router.put('/user-services/session/workspace', switchWorkspace)
router.delete('/user-services/session', logout)

module.exports = router
