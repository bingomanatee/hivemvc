var tap = require('tap');
var request = require('request');
var path = require('path');
var util = require('util');
var Gate = require('gate');
var tries = 500;
var max_ms_response = 4;
var test_interval = 200;
var hive_mvc = require('./../index');

tap.test('basic hive request.io', function (t) {
	var port = 3010;
	var server = require('./../test_resources/basic_app/app')(port);

	setTimeout(function () {

		var res = hive_mvc.Resource.list.resource('view_helper', 'foo');
		t.ok(res, 'found view helper foo');

		var pb_res = hive_mvc.Resource.list.resource('view_helper', 'post_bar');
		t.ok(pb_res, 'found view helper post_bar')

		var bar_model = hive_mvc.Model.list.get('bar');
		t.ok(bar_model, 'found model bar');

		request.get('http://localhost:' + port + '/foo', function (err, res, body) {
			body = body.replace(/[\n\r][\s]*/g, '');
			t.equal(body,'{"action": "foo","response": 2}', 'got /foo body');

			var gate = Gate.create();

			(function () {

				var la = gate.latch();

				request.get('http://localhost:' + port + '/bar', function (err, res, body) {

					body = body.replace(/[\n\r][\s]*/g, '');
					t.equal(body, '<h1>Bar view</h1><ul><li>2</li><li>4</li><li>6</li></ul>', 'get (bar) body');

					la();

					var i = tries;
					var d = new Date().getTime();
					while (--i) {
						var l = gate.latch();

						(function (j) {
							request.get('http://localhost:' + port + '/foo', function (err, res, body) {
								body = body.replace(/[\n\r][\s]*/g, '');
								if (!(j % test_interval)) {
									t.equal(body, '{"action": "foo","response": 2}', 'got body');
								}
								l();
							})
						})(i);
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
			})();

		})

	}, 1000);
})