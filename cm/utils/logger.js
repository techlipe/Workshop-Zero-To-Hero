var Log = require('log'),
    fs = require('fs'),
    log = new Log('debug', fs.createWriteStream('my.log'));

module.exports = log;