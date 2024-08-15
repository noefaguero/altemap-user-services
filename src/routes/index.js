const router = require('express').Router()
const { userLogin } = require('../controllers/userControllers')

const { knowUser } = require('../middlewares')

router.post('/login', userLogin)

router.use(knowUser())
router.use('/user-services/users', require('./userRoutes'))
router.use('/user-services/accreditations', require('./accreditationRoutes'))
router.use('/user-services/projects', require('./projectRoutes'))

module.exports = router
