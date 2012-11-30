var tap = require('tap');
var request = require('request');
var path = require('path');
var util = require('util');
var Gate = require('gate');
var tries = 10000;
var max_ms_response = 4

tap.test('basic hive request.io', function (t) {

	var app = require(path.resolve(__dirname, '../test_resources/basic_app/app'));

	setTimeout(function () {
			request.get('http://localhost:3010/foo/alpha/a.txt', function (err, res, body) {

				if (err){
					console.log('err on static file, %s', err.message());
				} else {
					t.equal(body, 'a.txt file', 'got content of a.txt');
					app.close();
					t.end();
				}


		})

	}, 1000);

})