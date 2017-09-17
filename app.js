var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    pages = {
        '/': fs.readFileSync('index.html'),
        '/payWall': fs.readFileSync('payWall.html'),
        '/css/styles.css': fs.readFileSync('css/styles.css'),
        '/js/wall.js': fs.readFileSync('js/wall.js'),
        '/favicon.ico': fs.readFileSync('favicon.ico')
    };

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    console.log(req.url);
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else if (req.url == '/theMoneyWall') {
        res.writeHead(200);
        res.write('<table><tr><td>Ron Paul</td><td>$5.00</td></tr><tr><td>Bernie</td><td>$15.00</td></tr></table>');
        res.end();
    } else {
        res.writeHead(200);
        res.write(pages[req.url]);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
