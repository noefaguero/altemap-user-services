const router = require('express').Router()

router.use('/user', require('./userRoutes'))
router.use('/accreditations', require('./accreditationRoutes'))
// router.use('/projects', require('./projectRoutes'))

module.exports = router
