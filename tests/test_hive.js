var mvc = require('./../index');
var Hive = mvc.Hive;
var Action = mvc.Action;

var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;
var fs = require('fs');
var action_loader = require('./../lib/loaders/action_loader');
var actions_loader = require('./.././lib/loaders/actions_loader');

var spawned = false;
var hive_test_spawn_dir = path.resolve(__dirname, '../test_resources/spawn');
var hive_test_dir = path.resolve(__dirname, '../test_resources/hive_test');
var hive_test_dir_2 = path.resolve(__dirname, '../test_resources/hive_test2');
var sa_root = path.resolve(__dirname, '../test_resources/single_action');
var actions_path = path.resolve(hive_test_dir, 'actions');
var single_path = path.resolve(sa_root, 'single');

if (true) {
	tap.test('action loader', function (t) {
		var action = Action({}, {root: single_path});
		action.init(function () {

			t.equals(action.action_script, path.resolve(single_path, 'single_action.js'), 'found action script');
			t.equals(action.action_config, path.resolve(single_path, 'single_config.json'), 'found config');
			t.end();
		});
	})
}

if (true) { // actions handler not usable independent of a root hive.
	tap.test('actions loader', function (t) {

		var asl = actions_loader(actions_path);

		asl.load(function () {
			var actions = _.map(asl.actions, function (action_loader) {
				return action_loader.get_config('root')
			});
			actions = _.sortBy(actions, _.identity);

			var expected = _.map(['bar', 'foo'], function (action) {
				return path.resolve(actions_path, action)
			});

			t.deepEqual(actions, expected, 'found foo and bar');
			t.end();

		})

	})
}

if (true) {
	tap.test('hive loader', function (t) {
		var hive = Hive({}, hive_test_dir_2);
		hive.init(function () {
				var actions = _.map(hive.actions, function (al) {
					return  al.get_config('root');
				});
				actions = _.sortBy(actions, _.identity);

				var expected = _.map(['bar', 'foo'], function (action) {
					return path.join(hive_test_dir_2, 'actions', action)
				});

				t.deepEqual(actions, expected, 'found foo and bar');
				t.end();
			})
	});
}

if (true) {
	tap.test('write hive action', function (t) {

		Hive.spawn(hive_test_spawn_dir, {reset: true, actions: ['foo', 'bar']}, function (err, result) {
			if (err) {
				console.log(err);
				t.end();
				return;
			}

			_.each([
				'actions',
				'actions/bar',
				'actions/bar/bar_action.js',
				'actions/bar/bar_config.json',
				'actions/foo',
				'actions/foo/foo_action.js',
				'actions/foo/foo_config.json' ], function (f) {
				var full_path = path.resolve(hive_test_dir_2, f);
				t.ok(fs.existsSync(full_path), 'file exists: ' + full_path);
				spawned = true;
			})

			t.end();
		})

	});
}
