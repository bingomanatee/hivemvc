var tap = require('tap');
var request = require('request');
var path = require('path');
var util = require('util');
var Gate = require('gate');

tap.test('test session get/set via session, context', function (t) {
	var port = 3022;
	var server = require('./../test_resources/basic_app/app')(port);

	setTimeout(function () {
		request.put('http://localhost:' + port + '/ses/put',
			{form:{key: 'user', value: 1000}},

			function (err, res, body) {
				if (err) throw err;
				body = body.replace(/[\n\r][\s]*/g, '');
				t.equal(body, '{"key": "user","value": "1000"}', 'got body');

				request.get('http://localhost:' + port + '/ses/get/user', function(err, res, body){
					body = body.replace(/[\n\r][\s]*/g, '');

					t.equal(body, '{"value": "1000"}', 'returning user body');
					server.close();
					t.end();
				});

			})

	}, 1000);

})