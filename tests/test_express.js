var tap = require('tap');
var request = require('request');
var path = require('path');
var util = require('util');
var Gate = require('gate');
var tries = 20;
var max_ms_response = 4;
var test_interval = 5;
var mvc = require('./../index');
var app_root = path.resolve(__dirname, './../test_resources/basic_app');
var app_file = path.resolve(app_root, 'app');

if (true) {
	tap.test('basic hive request.io', function (t) {
		var port = 3010;
		require(app_file)(port, function (err, apiary) {
			setTimeout(function () {
				// @TODO: refactor for apiary
				// t.equals(Frame.list.count(), 2, 'two frames in frame list');

				t.ok(apiary.Resource, 'found resources');

				var res = apiary.Resource.list.resource('view_helper', 'foo');
				t.ok(res, 'found view helper foo');

				var pb_res = apiary.Resource.list.resource('view_helper', 'post_bar');
				t.ok(pb_res, 'found view helper post_bar')

				var bar_model = apiary.model('bar');
				t.ok(bar_model, 'found model bar');

				var lm = apiary.model('$layouts');
				t.ok(lm, 'layouts model exists');

				var layouts = lm.count();

				t.equals(layouts, 1, 'have one layout');

				var layout = lm.get('foo_layout');

				t.equals(layout.get_config('template'), app_root + '/frames/test_frame/layouts/layout_foo/foo_view.html', 'layout template file');
				t.equals(layout.get_config('name'), 'foo_layout');

				request.get('http://localhost:' + port + '/long_no_error', function (err, res, body) {
					console.log('error: %s, body: %s' ,err, body);
					t.ok(/lne on_process\(get\) took longer than/.test(body), 'long method no error');

					request.get('http://localhost:' + port + '/long_error', function (err, res, body) {
						t.ok(/le on_process\(get\) took longer than/.test(body), 'long method error');

						request.get('http://localhost:' + port + '/foo', function (err, res, body) {
							body = body.replace(/[\n\r][\s]*/g, '');
							t.equal(body, '{"action": "foo","response": 2}', 'got /foo body');

							var gate = Gate.create();

							(function () {

								var la = gate.latch();

								request.get('http://localhost:' + port + '/bar', function (err, res, body) {

									body = body.replace(/[\n\r][\s]*/g, '');
									t.equal(body, '<foo><h1>Bar view</h1><ul><li>2</li><li>4</li><li>6</li></ul></foo>', 'get (bar) body');

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

									var tel = gate.latch();

									request.get('http://localhost:' + port + '/tt/te', {}, function (err, res, body) {
										//	console.log('=========== TE RESPONSE ===============: %s, %s,  %s', util.inspect(err), util.inspect(res), body);

										t.ok('vey is not defined'.search(body), 'found "vey is not defined"');

										tel();
									})

									la();

									gate.await(function () {
										var d2 = new Date().getTime();
										var duration = d2 - d;
										var ms_response = duration / tries;
										//	console.log('ms_response is %s ms', ms_response);
										t.ok(ms_response < max_ms_response, 'at most ' + max_ms_response + ' ms per response; tries = ' +
											tries);
										apiary.close();
										t.end();
									})
								})
							})();

						}) // end request 3

					}) // end request 2

				}) // end request 1

			}, 1000);
		});
	})
}

if (false) {

	tap.test('object linking', function (t) {
		var port = 3015;
		require(app_file)(port, function (err, apiary) {
			setTimeout(function () {
				apiary.Action.list.all().records().forEach(function (action) {
					console.log('action %s', util.inspect(action.root, false, 1));
				});
				apiary.Hive.list.all().records().forEach(function (action) {
					console.log('hive %s', util.inspect(action.root, false, 1));
				});
				apiary.close();
				t.end();
			}, 1000);
		});
	})
}