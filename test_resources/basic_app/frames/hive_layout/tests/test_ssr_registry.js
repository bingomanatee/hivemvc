var tap = require('tap');
var ssr_registry = require('ssr/registry');
var ssr_atomize = require('ssr/atomize_reg');
var _ = require('underscore');

tap.test('registry reordering', function (t) {

	var sri_req = [
		{
			file_id: 'jquery',
			pattern: 'jquery(\.min)?\.js$',
			reqs:    []
		},
		{
			file_id: 'backbone',
			pattern: 'backbone(-min)?\.js$',
			reqs:    ['underscore']
		},
		{
			file_id: 'underscore',
			pattern: 'underscore(-min)?\.js$',
			reqs:    []
		},
		{
			file_id: 'my_model',
			pattern: 'my_model\.js$',
			reqs:    ['backbone']
		}

	];

	var files = ['/js/vendor/jquery.js', '/js/jquery.js'];

	var reg = ssr_registry(sri_req, files);
	var oreg = _.sortBy(reg, 'file_id');

	t.deepEqual(oreg, [
		{
			"file":    "/js/vendor/jquery.js",
			"file_id": "jquery",
			"pattern": /jquery(.min)?.js$/,
			"reqs":    []
		}
	], 'compress jquery references');

	files = ['/js/vendor/backbone-min.js', '/underscore.js', '/my_model.js', '/underscore-min.js'];

	reg = ssr_registry(sri_req, files);
	oreg = _.sortBy(reg, 'file_id');

	t.deepEqual(oreg, [
		{
			"file":    "/js/vendor/backbone-min.js",
			"file_id": "backbone",
			"pattern": /backbone(-min)?.js$/,
			"reqs":    ["underscore"]
		},
		{
			"file":    "/my_model.js", // != "/underscore.js"
			"file_id": "my_model", // != "underscore"
			"pattern": /my_model.js$/,
			"reqs":    [
				"backbone" // != undefined
			]
		},

		{
			"file":    "/underscore.js",
			"file_id": "underscore",
			"pattern": /underscore(-min)?.js$/,
			"reqs":    []
		}
	], 'register backbone prereqs');

	ssr_atomize(reg, function (files) {
		t.deepEqual(files, [
			"/underscore.js",
			"/js/vendor/backbone-min.js",
			"/my_model.js"
		], 'underscore/backbone ordered files');

		reg.reverse();
		ssr_atomize(reg, function (files) {

			t.deepEqual(files, [
				"/underscore.js",
				"/js/vendor/backbone-min.js",
				"/my_model.js"
			], 'underscore/backbone ordered files, after reversing reg');
			t.end();
		})
	})

})