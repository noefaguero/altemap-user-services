const projectServices = require('../services/projectServices')

exports.getOriginsByTool = async ({ params }, res) => {
    const response = await projectServices.getOriginsByTool(params.tool)
    res.json(response)
    
}

exports.getOrigins = async (req, res) => {
    const response = await projectServices.getOrigins()
    res.json(response)
}