var Hive = require('./../index').Hive;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;
var fs = require('fs');
var action_loader = require('./../lib/loaders/action_loader');
var actions_loader = require('./.././lib/loaders/actions_loader');

var spawned = false;
var spawn_target = path.resolve(__dirname, '../test_resources/spawn');
var actions_path = path.resolve(spawn_target, 'actions');
var bar_path = path.resolve(spawn_target, 'actions/bar');

if (true) {
	tap.test('action loader', function (t) {

		action_loader(function (err, al) {

			al.load(function (err, result) {
				t.equals(al.action_script, path.resolve(bar_path, 'bar_action.js'), 'found action script');
				t.equals(al.action_config, path.resolve(bar_path, 'bar_config.json'), 'found config');
				t.end();
			})

		}, bar_path);

	})
}

if (false) { // actions handler not usable independent of a root hive.
	tap.test('actions loader', function (t) {

		actions_loader(function (err, asl) {
			asl.load(function (err, result) {
				var actions = _.map(asl.actions, function (action_loader) {
					return action_loader.get_config('root')
				})
				actions = _.sortBy(actions, _.identity);

				var expected = _.map(['bar', 'foo'], function (action) {
					return path.resolve(actions_path, action)
				});

				t.deepEqual(actions, expected, 'found foo and bar');
				t.end();

			})
		}, actions_path);

	})
}

if (true) {
	tap.test('hive loader', function (t) {
		var hive = Hive({},  spawn_target);
		hive.init(function () {
			hive.load(function(){
				var action_loaders = _.map(hive.action_loaders, function (al) {
				 return  al.get_config('root');
				});
				action_loaders = _.sortBy(action_loaders, _.identity);

				var expected = _.map(['bar', 'foo'], function (action) {
					return path.join(actions_path, action)
				});

				t.deepEqual(action_loaders, expected, 'found foo and bar');
				t.end();
			})
		})
	});
}

if (false) {
	tap.test('write hive action', function (t) {

		Hive.spawn(spawn_target, {reset: true, actions: ['foo', 'bar']}, function (err, result) {
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
				var full_path = path.resolve(spawn_target, f);
				t.ok(fs.existsSync(full_path), 'file exists: ' + full_path);
				spawned = true;
			})

			t.end();
		})

	});
}
