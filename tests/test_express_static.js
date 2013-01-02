var tap = require('tap');
var request = require('request');
var util = require('util');

tap.test('express static server', function (t) {
	var port = 3020;
	var server = require('./../test_resources/basic_app/app')(port);

	setTimeout(function () {
			request.get('http://localhost:' + port + '/foo/alpha/a.txt', function (err, res, body) {

				if (err){
					console.log('err on static file, %s', err.message());
				} else {
					t.equal(body, 'a.txt file', 'got content of a.txt');
					server.close();
					t.end();
				}
		})

	}, 1000);

})