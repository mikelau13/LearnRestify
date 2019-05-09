import restify from 'restify';
import sendV1, { sendV2, sendV3 } from './routes/versioningRoute';
import SearchCachedData from './api/memorycache.api';

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

server.get('/heartbeat', (req, res) => {
  res.setHeader(
    'cache-control',
    'no-cache, no-store, max-age=0, must-revalidate'
  );
  res.send('success');
});

server.get('/', function(req, res, next) {
    res.send('home')
    return next();
  });

server.get('/hello/:name', respond);
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

  // Error handling events
  server.on('InternalServer', function(req, res, err, callback) {
    // this will get fired first, as it's the most relevant listener
    console.log(err.message);
    return callback();
  });
  
  server.on('restifyError', function(req, res, err, callback) {
    // this is fired second.
    console.log(err.message);
    return callback();
  });
  

// memory-cache
server.get('/cache/:id', 
  function (req, res, next) {
    res.send('find - ' + SearchCachedData(req.params.id));
    return next();
  }
);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
