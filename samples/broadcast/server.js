
var objectstream = require('../../'),
    net = require('net'),
    sargs = require('simpleargs');

function Broadcaster()
{
	var nclients = 0;
	var clients = {};
	var broadcaster = this;
	
	this.newClient = function(client) {
        console.log("New Client");
		client.nclient = nclients++;
		clients[client.nclient] = client;
		client.on('data', function(obj) { broadcaster.broadcast(client, obj); });
		client.on('end', function() { broadcaster.removeClient(client); });
		client.on('close', function() { broadcaster.removeClient(client); });
	}
	
	this.removeClient = function(client) {
        console.log("Remove Client");
        client.removeAllListeners();
		delete clients[client.nclient];
	}
	
	this.broadcast = function(source, msg) {
		for (var n in clients)
		{
			var client = clients[n];
			if (client == source)
				continue;
			client.write(msg);
		}
	}
}

var broadcaster = new Broadcaster();

var server = net.createServer(function(socket) { broadcaster.newClient(objectstream.createStream(socket)); });

sargs.define('p', 'port', 3000, 'Port to listen');
var options = sargs.process(process.argv);
    
server.listen(options.port);

