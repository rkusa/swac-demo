var swac = require('swac')
  , Project = require('./models/project')
  , Task = require('./models/task')

// Root Route
var root = swac.get('/', function(app, done) {
  app.register('title', 'SWAC Demo Application')
  done.render('index')
})

// Projects Routes
var projects = root.get('/projects', function(app, done) {
  app.title = 'Projects'
  app.register('projects', swac.Observable.Array(Project))
  app.register('tasks', swac.Observable.Array(Task))
  app.tasks.sort(function(lhs, rhs) {
    var a = (lhs.task || '').toLowerCase()
      , b = (rhs.task || '').toLowerCase()
    if (a < b) return -1
    if (a === b) return 0
    else return 1
  })
  Project.list(function(err, projects) {
    if (err) throw err
    app.projects.reset(projects)
    done.render('projects')
  })
})

var project = projects.get('/:project', function(app, done, params) {
  var project = app.projects.find(params.project)
  if (!project) return done.redirect('/projects')
  app.register('project', project)
  done()
})

// Tasks Routes
var tasks = project.get('/tasks', function(app, done) {
  app.title = 'Tasks'
  Task.list('by-project', app.project.id, function(err, tasks) {
    app.tasks.reset(tasks)
    done.render('projects', 'tasks')
  })
}, function() {
  $('#todo-list').on('dblclick', 'li', function() {
    $(this).addClass('editing')
  })
})

tasks.post(function(app, done, params, body) {
  var task = new Task({
    project: app.project.id,
    task: body.task,
    isDone: false
  })
  app.tasks.push(task)
  task.save(function() {
    done.redirect('/projects/' + app.project.id + '/tasks', { silent: true })
  })
}, function() {
  $('#new-todo').val('')
})

tasks.delete('/:task', function(app, done, params) {
  var task = app.tasks.find(params.task)
  task.destroy(function() {
    done.redirect('/projects/' + app.project.id + '/tasks', { silent: true })
  })
})

tasks.get('/:task/toggle', function(app, done, params) {
  var task = app.tasks.find(params.task)
  task.isDone = !task.isDone
  task.save(function() {
    done.redirect('/projects/' + app.project.id + '/tasks', { silent: true })
  })
})

tasks.put('/:task', function(app, done, params, body) {
  var task = app.tasks.find(params.task)
  task.updateAttributes(body)
  task.save(function() {
    done.redirect('/projects/' + app.project.id + '/tasks', { silent: true })
  })
})

// Document Routes
var tasks = project.get('/docs', function(app, done) {
  app.title = 'Documents'
  done.render('projects', 'docs')
})