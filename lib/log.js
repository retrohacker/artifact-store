var bole = require('bole')
bole.output([
  { level: 'info', stream: process.stdout },
  { level: 'warn', stream: process.stderr },
  { level: 'error', stream: process.stderr }
])

module.exports = bole('artifact-store')
