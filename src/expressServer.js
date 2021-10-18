const route = require('./routes/routes.js');
const app= require('./server.js').app

app.use('/', route);

module.exports = app