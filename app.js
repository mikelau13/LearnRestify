var restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();

server.pre(restify.plugins.pre.dedupeSlashes());

server.use(function(req, res, next) {
    console.warn('run for all routes!');
    return next();
});


server.get('/hello/:name', respond);
server.get('/', function(req, res, next) {
    res.send('home')
    return next();
  });
server.head('/hello/:name', respond);
server.get('/foo:a',
  function(req, res, next) {
    req.someData = 'foo' + req.params.a;
    return next();
  },
  function(req, res, next) {
    res.send(req.someData);
    return next();
  }
);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
