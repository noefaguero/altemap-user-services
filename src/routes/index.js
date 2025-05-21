const router = require('express').Router()
const { passLog } = require('../middlewares')


router.use(passLog())
router.post('/user-services/session', require('./sessionRoutes'))
router.use('/user-services/accreditations', require('./accreditationRoutes'))
router.use('/user-services/projects', require('./projectRoutes'))



module.exports = router
