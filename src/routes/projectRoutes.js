const router = require('express').Router()
const { getOrigins, getOriginsByTool } = require('../controllers/projectControllers')

router.get('/origins', getOrigins)
router.get('/origins/:tool', getOriginsByTool)

module.exports = router