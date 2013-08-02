var swac = require('swac')
module.exports = swac.Model.define('Documents', function() {
  this.property('project', { required: true })
  this.property('name', { minLength: 1 })
  this.property('content')
})
