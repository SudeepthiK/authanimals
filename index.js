'use strict';
const config = require('./config')
const server = require('./app/server');
const routes = require('./app/routes');

const app = server.create();
routes.create(app);
app.listen(config.port, () => console.log('%s listening at %s', app.name, app.url));
