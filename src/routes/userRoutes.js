const router = require('express').Router()
const userControllers = require('../controllers/userControllers')

router.get('/me', userControllers.getUserById)

module.exports = router