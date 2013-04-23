var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');

var _DEBUG = false;

var mvc = require('./../index');
var apiary = mvc.Apiary({}, __dirname);

var hive_test_dir = path.resolve(__dirname, '../test_resources/hive_test');
var hive_test_dir_2 = path.resolve(__dirname, '../test_resources/hive_test2');
var sa_root = path.resolve(__dirname, '../test_resources/single_action');
var actions_path = path.resolve(hive_test_dir, 'actions');
var single_path = path.resolve(sa_root, 'single');
var foo_bar_actions = _.map(['bar', 'foo'], function (action) {
	return path.resolve(actions_path, action)
});

var foo_bar_hive_actions =  _.map(['bar', 'foo'], function (action) {
	return path.resolve(hive_test_dir_2, 'actions', action)
});

apiary.init(function () {

	var Hive = apiary.Hive;
	var Action = apiary.Action;

	var fs = require('fs');
	var action_loader = require('./../lib/loaders/action_loader');
	var actions_loader = require('./.././lib/loaders/actions_loader');

	var spawned = false;

	if (true) {
		tap.test('action loader', function (t) {
			var action = Action({}, {root: single_path});
			action.init(function () {

				t.equals(action.action_script, path.resolve(single_path, 'single_action.js'), 'found action script');
				t.deepEqual(action.get_config('routes'), { get: [ '*/bar' ],
					put:                                        [ '*/bar' ],
					post:                                       [ '*/bar' ],
					delete:                                     [ '*/bar' ] }, 'loaded routes')
				t.end();
			});
		})
	}

	if (false) {
		/**
		 * Note - this test also validates discreteness of dataspaces between apiary and apiary2.
		 * @type {*}
		 */
		var apiary2 = mvc.Apiary({}, __dirname);
		apiary2.init(function () {
			tap.test('actions loader', function (t) {

				var asl = actions_loader(actions_path, {}, apiary2);
				console.log("loading actions from %s", actions_path);
				asl.load(function () {

					var actions_list = apiary2.model('$actions');

					var action_roots = _.map(actions_list.all().records(), function (action) {
						return action.get_config('root')
					});
					actions = _.sortBy(action_roots, _.identity);

					t.deepEqual(actions, foo_bar_actions, 'found foo and bar');
					t.end();

				})

			})
		});
	};

	if (false) {
		/**
		 * this test is essentially the above - only validating that the hive one level up will
		 * find the same set of actions.
		 * @type {*}
		 */

		var apiary3 = mvc.Apiary({}, __dirname);
		apiary3.init(function(){

			tap.test('hive loader', function (t) {
				var hive = apiary3.Hive({}, hive_test_dir_2, apiary3);
				hive.init(function () {

					var actions_list = apiary3.model('$actions');

					var actions = _.map(actions_list.all().records(), function (action) {
						return  action.get_config('root');
					});
					actions = _.sortBy(actions, _.identity);

					t.deepEqual(actions, foo_bar_hive_actions, 'found foo and bar in hive');
					t.end();
				})
			});


		})
	}

})