var swac = require('swac')
module.exports = swac.Model.define('Tasks', function() {
  this.property('project', { required: true })
  this.property('task', { minLength: 1 })
  this.property('isDone')
})