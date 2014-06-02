var http = require('http'),
	mysql = require('mysql'),
	cluster = require('cluster'),
	numCPUs = require('os').cpus().length,
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'sandals',
	});

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
		connection.query('SELECT * FROM classicmodels.customers', function(err, rows) {
			if(err) console.log(err);

			body+= '<table><tr>';
			body+= '<th>Customer #</th>';
			body+= '<th>Customer Name</th>';
			body+= '<th>Phone</th>';
			body+= '<th>City</th>';
			body+= '<th>Country</th>';
			body+= '<th>Credit limit</th></tr>';
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				body+= '<tr><td>'+row.customerNumber+'</td>';
				body+= '<td>'+row.customerName+'</td>';
				body+= '<td>'+row.phone+'</td>';
				body+= '<td>'+row.city+'</td>';
				body+= '<td>'+row.country+'</td>';
				body+= '<td>'+row.creditLimit+'</td></tr>';
			};
			body+= '</table>';
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(body);
			res.end();
		})
	}).listen(3000);


	process.on('SIGINT', function(){
		connection.destroy()
		server.close();
	});
}