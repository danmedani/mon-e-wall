var express = require('express');
var http = require('http');
var fs = require('fs')
var app = express();
var server = http.createServer(app);
var stripe = require('stripe')('sk_test_Ju8gpMkvbyNaNq3bI4myYsrq');

const bodyParser = require('body-parser');

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// pages = {
//     '/': fs.readFileSync('view/index.html'),
//     '/payWall': fs.readFileSync('view/payWall.html'),
//     '/css/styles.css': fs.readFileSync('css/styles.css'),
//     '/js/wall.js': fs.readFileSync('js/wall.js'),
//     '/favicon.ico': fs.readFileSync('favicon.ico')
// };

app.post('/chargeMoney', function(req, res){
    var token = req.body.stripeToken;

    // Charge the user's card:
    stripe.charges.create({
      amount: 1000,
      currency: "usd",
      description: "Example charge",
      source: token,
    }, function(err, charge) {
      res.send('You just paid for the money wall. <br><a href="/">Back to the Wall</a>');
    });
}); 

app.get('/css/styles.css', function(req, res) {
    res.sendFile(__dirname + '/css/styles.css');
}); 

app.get('/payWall', function(req, res) {
    res.sendFile(__dirname + '/view/payWall.html');
});

app.get('/theMoneyWall', function(req, res) {
    res.writeHead(200);
    res.write('<table><tr><td>Ron Paul</td><td>$5.00</td></tr><tr><td>Bernie</td><td>$15.00</td></tr></table>');
    res.end();
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/view/index.html');
});

app.get('/js/wall.js', function(req, res) {
    res.sendFile(__dirname + '/js/wall.js');
}); 

app.listen(3000);

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + 3000 + '/');
