var Task = require('./task')
Task.extend(function() {
  this.use('couchdb', { db: 'demo' }, function() {
    this.view('by-project', {
      map: function(doc) {
        if (doc.$type === 'Tasks')
          emit(doc.project, null)
      }
    })
  })
})