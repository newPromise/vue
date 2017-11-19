
var http = require('http');
const fs = require('fs');
let lyrics = [];
const base = '../data/lyrics/';
let urlIndex = 0;
const urls = [
	'张杰-勿忘心安.lrc',
	'陈奕迅-浮夸.lrc',
	'陈奕迅-十年.lrc'
];

function readFile() {
	let url = urls[urlIndex];
	fs.readFile(base + url, 'utf8', (err, data) => {
		if (err) {
			return;
		}
		if (data) {
			lyrics.push(data);
			urlIndex++;
			readFile();
		}
	})
}

readFile();
let request = {};
request.response = "hello";
http.createServer(function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
		res.write(JSON.stringify(lyrics));
		res.end();
}).listen(8090, '127.0.0.1');
