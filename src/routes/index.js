const router = require('express').Router()
const { passLogger, reqLogger } = require('../middlewares')

router.use(reqLogger()) // dev mode
router.use(passLogger())

router.use('/user-services/session', require('./sessionRoutes'))
router.use('/user-services/projects', require('./projectRoutes'))



module.exports = router
