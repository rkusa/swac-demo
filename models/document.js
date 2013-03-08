var swac = require('swac')
module.exports = swac.Model.define('Documents', function() {
  this.use('couchdb', { db: 'demo' }, function() {
    this.view('by-project', {
      map: function(doc) {
        if (doc.$type === 'Documents')
          emit(doc.project, null)
      }
    })
  })
  this.property('project', { required: true })
  this.property('name', { minLength: 1 })
  this.property('content')
})
