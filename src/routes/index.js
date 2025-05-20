const router = require('express').Router()
const { userLogin } = require('../controllers/userControllers')
const { refreshSession } = require('../controllers/sessionControllers')
const { passLog } = require('../middlewares')

router.post('/user-services/session', userLogin)
router.put('/user-services/session', refreshSession)


router.use(passLog())
router.use('/user-services/accreditations', require('./accreditationRoutes'))
router.use('/user-services/projects', require('./projectRoutes'))



module.exports = router
