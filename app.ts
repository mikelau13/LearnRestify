import restify from 'restify';
//var restify = require('restify');
import sendV1, { sendV2, sendV3 } from './routes/versioningRoute';

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
server.del('/hello/:name', function rm(req, res, next) {
    res.send(204);
    return next();
  });
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

// server.get(/^\/([a-zA-Z0-9_\.~-]+)\/(.*)/, function(req, res, next) {
//   console.log(req.params[0]);
//   console.log(req.params[1]);
//   res.send(200);
//   return next();
// });


// Hypermedia
server.get({name: 'city', path: '/cities/:slug'},
  function (req, res, next) {
    res.send('city is ' + req.params.slug);
    return next();
  }
);

server.get('/anotherroute',
    function (req, res, next) {
        res.send({
            country: 'Australia',
            // render a URL by specifying the route name and parameters
            capital: server.router.render('city', {slug: 'canberra'}, {details: true})
        })
    }
);

//versioning
server.get('/versioning/:name', restify.plugins.conditionalHandler([
    { version: ['1.0.0', '1.1.3', '1.1.8'], handler: sendV1 },
    { version: ['2.0.0', '2.1.0', '2.2.0'],
        handler: function (req, res, next) {
        res.send(200, {
            requestedVersion: req.version(),
            matchedVersion: req.matchedVersion()
        });
        return next();
        }
    },
    { version: '3.0.0', handler: sendV2 }
  ]));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
