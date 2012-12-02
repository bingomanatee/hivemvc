var tap = require('tap');
var request = require('request');
var path = require('path');
var util = require('util');
var Gate = require('gate');
var tries = 50;
var max_ms_response = 4

tap.test('basic hive request.io', function (t) {
	var port = 3010;
	var server = require('./../test_resources/basic_app/app')(port);

	setTimeout(function () {

		request.get('http://localhost:' + port + '/foo', function (err, res, body) {
			body = body.replace(/[\n\r][\s]*/g, '');
			t.equal(body, '{"action": "foo","response": 2}', 'got body');

			var gate = Gate.create();
			var i = tries;
			var d = new Date().getTime();
			while (--i) {
				var l = gate.latch();

				request.get('http://localhost:' + port + '/foo', function (err, res, body) {
					body = body.replace(/[\n\r][\s]*/g, '');
					t.equal(body, '{"action": "foo","response": 2}', 'got body');
					l();
				})

			}

			gate.await(function () {

				var d2 = new Date().getTime();
				var duration = d2 - d;
				var ms_response = duration / tries;
				console.log('ms_response is %s ms', ms_response);
				t.ok(ms_response < max_ms_response, 'at most ' + max_ms_response + ' ms per response; tries = ' +
					tries);
				server.close();
				t.end();
			})
		})

	}, 1000);
})