const router = require('express').Router()
const login = require('../controllers/loginController')
const aggregate = require('../controllers/aggregationController')

const { knowUser } = require('../middlewares')

router.post('/login', login)

router.use(knowUser())
// router.use('/user-services/users', require('./userRoutes'))
router.use('/user-services/accreditations', require('./accreditationRoutes'))
router.use('/user-services/projects', require('./projectRoutes'))
router.get('/user-services/aggregation', aggregate)


module.exports = router
