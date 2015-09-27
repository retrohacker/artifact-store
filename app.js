var app = require('express')()
var config = require('./lib/config.js')
var upload = require('./lib/upload.js')
var fetch = require('./lib/fetch.js')
var uuid = require('./lib/uuid')
var log = require('./lib/log.js')

app.use(uuid)

app.post('/:user/:package/:version',upload)
app.post('/:package/:version',upload)

app.get('/:user/:package/:version',fetch)
app.get('/:package/:version',fetch)

var server = app.listen(config.server.port,function(e) {
  log.info('Server running on '+server.address().address+':'+server.address().port)
})
