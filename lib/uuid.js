var uuid = require('node-uuid')
module.exports = function(req,res,next) {
  req.uuid = uuid.v4()
  next()
}
