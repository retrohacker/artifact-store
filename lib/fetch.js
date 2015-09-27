var path = require('path')
var log = require('./log.js')
var config = require('./config.js')

module.exports = function fetch(req,res) {
  var blobstore = config.registry.blobstore
  if(!req.params.user) req.params.user = '__global'
  if(!req.params.package || !req.params.version) return res.status(400).end()
  var key = path.join(req.params.user,req.params.package,req.params.version,'package.tgz')
  log.debug("Received request to fetch tarball from ",key)
  blobstore.createReadStream({key:key}).pipe(res)
    .on('finish',function() {
      res.end()
    })
    .on('error',function(e) {
      res.end()
      log.error("req.uuid - "+JSON.stringify(e))
    })
}
