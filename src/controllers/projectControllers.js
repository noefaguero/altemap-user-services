const projectServices = require('../services/projectServices')

const getDomains = async (req, res) => {
    const objects = await projectServices.getDomains()
    // filtro de origenes validos segun entorno
    const domainField = process.env.NODE_ENV !== 'development' ? 'domain' : 'dev_domain'

    const origins = objects.filter(object => object[domainField]) // se descartan undefined
        .map(object => `${process.env.PROTOCOL}://${object[domainField]}`)
    
    res.json({ origins })
}

module.exports = {
    getDomains
}