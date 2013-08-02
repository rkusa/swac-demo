var Document = require('./document')
Document.extend(function() {
  this.use('couchdb', { db: 'demo' }, function() {
    this.view('by-project', {
      map: function(doc) {
        if (doc.$type === 'Documents')
          emit(doc.project, null)
      }
    })
  })
})