import 'dotenv/config';
import restify, { plugins, Request, Response, Next } from 'restify';
import sendV1, { sendV2, sendV3 } from './routes/versioningRoute';
import SearchCachedData from './api/memorycache.api';
import routesByMethod from './api/src/routes';
import DummyDataService from './api/src/services/dummyDataService';

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
DummyDataService.init();
const port = parseInt(process.env.PORT, 10) || 3000;

// plugins doc: http://restify.com/docs/plugins-api/#serverpre-plugins
server.pre(restify.plugins.pre.context()); //  creates req.set(key, val) and req.get(key) methods
server.pre(restify.plugins.pre.sanitizePath()); // Cleans up sloppy URLs on the request object, like /foo////bar/// to /foo/bar.
server.use(restify.plugins.acceptParser(server.acceptable)); // by default, server.acceptable = [ 'application/json',  'text/plain',  'application/octet-stream',  'application/javascript' ]
server.use(restify.plugins.authorizationParser()); // Parses out the Authorization header 
server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser({ mapParams: false }));
server.use(restify.plugins.urlEncodedBodyParser());

// better example here - https://stackoverflow.com/questions/27440370/how-to-use-restifys-requestlogger
server.use(restify.plugins.requestLogger({
  properties: {
      foo: 'bar'
  }
}));


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

// setup routes by methods
// routesByMethod.get.forEach(route =>
//   server.get(route.path, restify.plugins.conditionalHandler(route.handlers))
// );

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


// dotenv
server.get('/dotenv', 
  function (req, res, next) {
    const testConfig = process.env.CURRENT_API_VERSION || undefined;
    res.send('CURRENT_API_VERSION=' + testConfig);
    return next();
  }
);


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
