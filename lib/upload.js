var path = require('path')
var log = require('./log.js')
var config = require('./config.js')

module.exports = function upload(req,res) {
  var blobstore = config.registry.blobstore
  if(!req.params.user) req.params.user = '__global'
  if(!req.params.package || !req.params.version) return res.status(400).end()
  var key = path.join(req.params.user,req.params.package,req.params.version,'package.tgz')
  log.debug("Received request to write tarball to ",key)
  req.pipe(blobstore.createWriteStream({key:key}))
    .on('finish',function() {
      res.status(201).end()
    })
    .on('error',function(e) {
      res.status(500).json({uuid:req.uuid})
      log.error("req.uuid - "+JSON.stringify(e))
    })
}
