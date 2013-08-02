var swac = require('swac')
module.exports = swac.Model.define('Projects', function() {
  this.property('name', { minLength: 1 })
})