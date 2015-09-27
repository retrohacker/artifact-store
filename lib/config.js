var config = module.exports = require('config')
var log = require('./log.js')
var tmp = require('tmp')

/* Validate Config */
if(!config.registry) config.registry = {}
if(!config.registry.type) config.registry.type = 'fs'
// Sync is dirty, but only way to do without yielding event loop during bootstrap process
if(!config.registry.path) config.registry.path = tmp.dirSync().name
if(config.registry.type === 'fs')  config.registry.blobstore = require('fs-blob-store')(config.registry.path)
else throw new Error('Invalid storage type')

log.debug(config)
