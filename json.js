var sys = require('sys'),
	http = require('http'),
	fs = require('fs'),
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
		fs.readFile('./random.json',function(err, data){
			var data = JSON.parse(data);
			for (var i = 0; i < data.length; i++) {
				body += '<h2>'+data[i].company+'</h2>';
				body += '<p>'+data[i].about+'</p>';
				body += '<img src="'+data[i].picture+'" alt="" />';
			};
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(body);
			res.end();
		});
	}).listen(3000);
}