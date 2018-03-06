const restify = require('restify');

function setup(server) {
  server.pre(restify.pre.sanitizePath());

  server.use(restify.plugins.queryParser({ mapParams: true }));
  server.use(restify.plugins.bodyParser({ mapParams: false }));
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.requestLogger());
  server.on('NotFound', function (req, res, err, cb) {
    return cb();
  });
}

exports.create = () => {
  const server = restify.createServer();
  setup(server);
  return server;
}
