var test = require('tape')
var upload = require('../lib/upload.js')
var request = require('request')
var express = require('express')
var getPort = require('get-port')
var hash_file = require('hash_file')
var path = require('path')
var fs = require('fs')
var config = require('../lib/config.js')
var upload = require('../lib/upload.js')
var fetch = require('../lib/fetch.js')
var tmp = require('tmp')

test('Fetch a package', function(t) {
  t.plan(3)
  getPort(function(e,port) {
    if(e) return t.fail(e)
    var app = express()
    app.post('/:package/:version',upload)
    app.get('/:package/:version',fetch)
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
                var file = tmp.fileSync()
                request(url)
                  .pipe(fs.createWriteStream(file.name))
                  .on('error',function(e) {
                    t.fail(e)
                  }) // end onerror
                  .on('finish',function() {
                    hash_file(file.name,function(e,hash3) {
                      if(e) return t.fail(e)
                      t.equal(hash3,hash1,'Ensure fetched file matches original')
                      server.close()
                    }) //end hash_file
                  }) // end on finish
              }) //end hash_file
            }) //end on response
          ) // end createReadStream
        }) //end app.listen
      })
    })
  })
})
