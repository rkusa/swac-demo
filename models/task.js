var swac = require('swac')
module.exports = swac.Model.define('Tasks', function() {
  this.use('couchdb', { db: 'demo' }, function() {
    this.view('by-project', {
      map: function(doc) {
        if (doc.$type === 'Tasks')
          emit(doc.project, null)
      }
    })
  })
  this.property('project', { required: true })
  this.property('task', { minLength: 1 })
  this.property('isDone')
})