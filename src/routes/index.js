const router = require('express').Router()
const { passLog } = require('../middlewares')

if (process.env.NODE_ENV === 'development') {
    router.use((req, res, next) => {
        console.log(`REQUEST: ${req.protocol}://${req.get('Host')}${req.originalUrl}`)
        console.log(req.body ? `body: ${JSON.stringify(req.body)}` : '')
        next()
    })
}

router.use(passLog())
router.use('/user-services/session', require('./sessionRoutes'))
router.use('/user-services/projects', require('./projectRoutes'))



module.exports = router
