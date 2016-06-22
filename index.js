var fs = require('fs');
var path = require('path');
var server = require('./server');
var util = require('./util');

var argv = process.argv.splice(2);
var config = {};

if(argv.length !== 8) {
    console.log('Error: get parameter error.')
} else {
    config.port = argv[1];
    config.root = argv[3];
    config.comboBase = argv[5];
    config.comboSep = argv[7];
    
    server(config);
}