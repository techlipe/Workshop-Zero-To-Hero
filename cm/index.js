var apm = require('elastic-apm-node').start({
    serviceName: 'cm-back',

    secretToken: '',

    serverUrl: 'http://localhost:8200/'
  });
  
var config = require('./config.js');


var express = require('express'),
    path = require('path'),
    logger = require('./utils/logger.js'),
    bodyParser = require('body-parser'),
    app = express(),

    cmRoutes = require('./routes/cm.js'),
    http = require('http'),
    port,
    server;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/angular", express['static'](path.resolve(__dirname, "node_modules/angular")));
app.use("/angular-sanitize", express['static'](path.resolve(__dirname, "node_modules/angular-sanitize")));
app.use("/angular-animate", express['static'](path.resolve(__dirname, "node_modules/angular-animate")));
app.use("/angular-aria", express['static'](path.resolve(__dirname, "node_modules/angular-aria")));
app.use("/angular-messages", express['static'](path.resolve(__dirname, "node_modules/angular-messages")));
app.use("/angular-material", express['static'](path.resolve(__dirname, "node_modules/angular-material")));
app.use("/angular-ui-router", express['static'](path.resolve(__dirname, "node_modules/angular-ui-router/release")));
app.use("/fontawesome", express['static'](path.resolve(__dirname, "node_modules/@fortawesome/fontawesome-free")));
app.use("/moment", express['static'](path.resolve(__dirname, "node_modules/moment")));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/cm', cmRoutes);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

port = normalizePort(process.env.PORT || config.expressPort);

app.set('port', port);

server = http.createServer(app);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    logger.debug('Listening on ' + bind);
}

server.on('error', onError);
server.on('listening', onListening);

server.listen(port);
