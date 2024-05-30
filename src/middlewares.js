exports.getPass = () => {
    return (req, res, next) => {
      JSON.parse(req.headers['X-Pass'])
      next()
    }
}