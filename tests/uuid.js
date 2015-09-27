var test = require('tape')
var uuid = require('../lib/uuid.js')
var express = require('express')
var request = require('request')
var getPort = require('get-port')

test('Ensure uuid middleware populates req.uuid',function(t) {
  t.plan(1)
  //Setup server
  var app = express()
  app.use(uuid)
  app.get('/',function(req,res) {
    t.ok(req.uuid,'ensure uuid is set')
    res.end()
  })
  getPort(function(e,port) {
    var server = app.listen(port,function(e) {
      if(e) t.fail(e)
      var url = 'http://127.0.0.1:'+server.address().port+'/'
      request(url,function(e,resp) {
        if(e) t.fail(e)
        server.close()
      })
    })
  })
})
