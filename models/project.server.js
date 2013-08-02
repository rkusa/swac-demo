var Project = require('./project')
Project.extend(function() {
  this.use('couchdb', { db: 'demo' })
})