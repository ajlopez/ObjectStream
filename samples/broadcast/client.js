
var objectstream = require('../../'),
    net = require('net'),
    sargs = require('simpleargs');
    
// Define command line arguments
sargs.define('p', 'port', 3000, 'Server port')
    .define('h', 'host', 'localhost', 'Server name')
    .define('t', 'timeout', 1000, 'Timeout')
    .defineValue('message', 'Hello, world', 'Message to send');
    
// Process arguments
var options = sargs.process(process.argv);

var objstream = objectstream.createStream(net.connect(options.port, options.host, run));
objstream.on('data', function (obj) { console.dir(obj); });

function run() {
    var obj = { date: new Date().toString(), message: options.message };
    console.dir(obj);
    objstream.write(obj);
    setTimeout(run, options.timeout);
}
