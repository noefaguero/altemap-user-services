const router = require('express').Router()
const { getDomains } = require('../controllers/projectControllers')

router.get('/origins', getDomains)


module.exports = router