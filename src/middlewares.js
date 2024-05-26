exports.getPass = () => {
    return (req, res, next) => {
      JSON.parse(req.headers['x-pass'])
      next()
    }
  }