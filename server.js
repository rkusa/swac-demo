var swac = require('swac/server')
  , app = swac.app
  , express = swac.express
  , helmet  = require('helmet')

app.configure(function() {
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.use(express.favicon())
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  
  // Security-related HTTP Header
  app.use(helmet.hsts())               // Strict Transport Security
  // app.use(helmet.csp())             // Content Security Policy
  app.use(helmet.xframe('deny'))       // X-FRAME-OPTIONS
  app.use(helmet.iexss())              // X-XSS-PROTECTION
  app.use(helmet.contentTypeOptions()) // X-Content-Type-Options
  app.use(helmet.cacheControl())       // Cache-Control

  app.use(swac.middleware('/js'))
  
  // app.use(express.cookieParser())
  // app.use(express.session({
  //   secret: 'your-secret',
  //   cookie: { httpOnly: true }
  // }))
  
  app.use(require('less-middleware')({ src: __dirname + '/assets' }))
  app.use(express.static(__dirname + '/assets'))
})

app.configure('development', function() {
  app.use(express.errorHandler())
  app.use(express.logger('dev'))
})

swac.area(__dirname + '/app')

var server = module.exports = require('http').createServer(app)

swac.ready(function() {
  server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'))
  })
})
