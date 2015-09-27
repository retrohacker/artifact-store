var test = require('tape')
var upload = require('../lib/upload.js')
var request = require('request')
var express = require('express')
var getPort = require('get-port')
var hash_file = require('hash_file')
var path = require('path')
var fs = require('fs')
var config = require('../lib/config.js')

test('Upload a package', function(t) {
  t.plan(2)
  getPort(function(e,port) {
    if(e) return t.fail(e)
    var app = express()
    app.post('/:package/:version',upload)
    var file = path.join(__dirname,'assets','package.tgz')
    hash_file(file,'md5',function(e,hash1) {
      if(e) return t.fail(e)
      getPort(function(e,port) {
        if(e) return t.fail(e)
        var server = app.listen(port,function() {
          var url = 'http://127.0.0.1:'+server.address().port+'/test/0.0.1'
          fs.createReadStream(file).pipe(request.post(url)
            .on('error',function(e) {
              t.fail(e)
            })
            .on('response',function(res) {
              t.equal(res.statusCode,201,"Ensure response code is 201")
              hash_file(path.join(config.registry.blobstore.path,'__global','test','0.0.1','package.tgz'),function(e,hash2) {
                if(e) return t.fail(e)
                t.equal(hash1,hash2,"Ensure uploaded file is the same")
              })
            })
          )
          request(url,function(e,resp) {
            server.close()
          })
        })
      })
    })
  })
})
