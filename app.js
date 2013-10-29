var swac = require('swac')
  , Project = require('./models/project')
  , Task = require('./models/task')

// Root Route
var root = swac.get('/', function(app, done) {
  app.register('title', null)
  app.register('location', null)
  app.title = 'SWAC Demo Application'
  done.render('index')
})

// Projects Routes
var projects = root.get('/projects', function(app, done) {
  app.title = 'Projects'
  app.location = null
  app.register('projects', swac.Observable.Array(Project))
  app.register('project', null)
  app.register('tasks', swac.Observable.Array(Task))
  
  app.projects.sortBy('name')
  app.tasks.sortBy('taks')

  Project.list(function(err, projects) {
    if (err) throw err
    app.projects.reset(projects)
    done.render('projects')
  })
})

var project = projects.get('/:project', function(app, done, params) {
  app.location = null
  app.project = app.projects.find(params.project)
  if (!app.project) return done.redirect('/projects')
  done.render('project', 'projects')
})

// Tasks Routes
var tasks = project.get('/tasks', function(app, done) {
  app.location = 'tasks'
  app.title = 'Tasks'
  Task.list('by-project', app.project.id, function(err, tasks) {
    app.tasks.reset(tasks)
    done.render('tasks', 'projects')
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
  task.save(function(err) {
    if (err) throw err
    done.redirect('.', { silent: true })
  })
}, function() {
  $('#new-todo').val('')
})

tasks.delete('/:task', function(app, done, params) {
  var task = app.tasks.find(params.task)
  task.destroy(function() {
    done.redirect('..', { silent: true })
  })
})

tasks.get('/:task/toggle', function(app, done, params) {
  var task = app.tasks.find(params.task)
  task.isDone = !task.isDone
  task.save(function() {
    done.redirect('../..', { silent: true })
  })
})

tasks.put('/:task', function(app, done, params, body) {
  var task = app.tasks.find(params.task)
  task.updateAttributes(body)
  task.save(function() {
    done.redirect('..', { silent: true })
  })
})

// Document Routes
var tasks = project.get('/docs', function(app, done) {
  app.location = 'docs'
  app.title = 'Documents'
  done.render('docs', 'projects')
})