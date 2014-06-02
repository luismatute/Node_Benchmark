var sys = require('sys'),
	http = require('http'),
	cluster = require('cluster'),
	numCPUs = require('os').cpus().length;

if(cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	var server = http.createServer(function(req, res) {
		var body = '';
		for (var i = 0; i <= 1000; i++) {
			body += i+'<br>'
		};
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(body);
		res.end();
	}).listen(3000);
}