const router = require('express').Router()
const { login, recoverSession, switchWorkspace, logout } = require('../controllers/sessionControllers')

router.post('/', login)
router.get('/', recoverSession)
router.put('/workspace', switchWorkspace)
router.delete('/', logout)


module.exports = router
