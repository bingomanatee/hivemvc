var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var mvc = require('./../index');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

/* ************************* TESTS ****************************** */

if (true) {
	tap.test('apiary', function (t) {
		var apiary = mvc.Apiary({}, __dirname);
		apiary.init(function () {
			var dataspace = apiary.get_config('dataspace');
			apiary.Resource( {name: 'foo'}, {},function (err, res1) {
				t.ok(res1, 'made a resource');

				if (res1) {

					res1.init(function () {

						var resources = apiary.model('$resources');

						t.ok(resources, 'found resources');

						if (resources) {

							var res1_from_model = resources.find({name: 'foo'}).one();
							t.ok( res1_from_model, 'res1 found in model');

							t.equal(res1_from_model.component_id, res1.component_id, 'res1_from_model == res1');

							t.end(); //@TODO: test more resources

						} else {
							t.end();

						}
					});
				} else {
					t.end();
				}

			});
		})

	}) // and tap.test 2
}