var http = require('http');
let request = {};
request.response = "hello";
console.log('yes');
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify(request));
}).listen(8090, '127.0.0.1');
