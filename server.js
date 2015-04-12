var express = require('express')
var app = express()
var Q = require('Q')

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

var nano = require('nano')('http://localhost:5984')
var posts = nano.db.use('posts')

app.get('/', function(request, response) {
	// save({'test': true})
	var thing = []
	posts.list(function(err, body) {
		if (!err) {
			body.rows.forEach(function (doc) {
				thing.push(doc)
			})
			response.send(thing)
		}
	})
})

var save = function(doc) {
  var deferred = Q.defer()

  posts.insert(doc, function(err, body) {
    if (err) {
      deferred.reject(new Error(err))
    } else {
      deferred.resolve(body)
    }
  })

  return deferred.promise
}


var getAllPosts = function() {
  var deferred = Q.defer()

  posts.view('ok', 'byPlayer_sum', {}, function(err, body) {
    if (err) {
      deferred.reject(new Error(err))
    } else {
      if (!body.rows.length) {
        deferred.resolve(0)
      } else {
        deferred.resolve(body.rows[0].value)
      }
    }
  })

  return deferred.promise

};

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
