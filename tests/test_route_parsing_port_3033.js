var tap = require('tap');
var request = require('request');
var path = require('path');
var util = require('util');
var Gate = require('gate');

tap.test('test session get/set via session, context', function (t) {
	var port = 3033;
	var server = require('./../test_resources/app_with_route_parsing/app')(port);

	setTimeout(function () {
		request.get('http://localhost:' + port + '/alpha/bar',
			function (err, res, body) {
				if (err) throw err;
				t.equals(body, '<h1>Maggie Alpha Bar</h1>');

				request.get('http://localhost:' + port + '/bar',
					function (err, res, body) {
						if (err) throw err;
						t.equals(body, '<h1>Maggie Beta Bar</h1>');

						request.get('http://localhost:' + port + '/lisa/bar',
							function (err, res, body) {
								if (err) throw err;
								t.equals(body, '<h1>Lisa Alpha Bar</h1>');

								request.get('http://localhost:' + port + '/maggie/alpha/bar/txt/foo.txt',
									function (err, res, body) {
										if (err) throw err;
										t.equals(body, 'maggie alpha bar txt');

										request.get('http://localhost:' + port + '/alpha/csv/nelson.csv',
											function (err, res, body) {
												if (err) throw err;
												t.equals(body, 'maggie,alpha,bar,csv,nelson');
												t.end();
											});
									});
							});
					});
			});

	}, 1000);

})