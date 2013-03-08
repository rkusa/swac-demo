var swac = require('swac')
module.exports = swac.Model.define('Projects', function() {
  this.use('couchdb', { db: 'demo' })
  
  this.property('name', { minLength: 1 })
})