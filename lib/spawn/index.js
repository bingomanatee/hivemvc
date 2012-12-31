var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var Component = require('hive-component');
var mkdirp = require('mkdirp')
var Gate = require('gate');
var _DEBUG = false;
var rmdir = require('rmdir');

var spawn_action_dir = require('./action_dir');

function _spawn_action(self, root, action, cb) {
	var args = _.toArray(arguments);
	if (_DEBUG) console.log('_spawn_action(%s)', util.inspect(args));
	var action_dir = path.resolve(root, 'actions');
	if (_DEBUG) console.log('_spawn_action for action dir %s', action_dir);

	if (_.isObject(action)) {
		spawn_action_dir(action_dir, action.name, cb, action);
	} else {
		spawn_action_dir(action_dir, action, cb);
	}
}

function _spawn(self, root, config, cb) {

	fs.exists(root, function (e) {
		if (!e) {
			mkdirp(root, function (e) {
				if (e) {
					return cb(new Error('cannot make directory ' + root));
				} else {
					_do_spawn(self, root, config, cb);
				}
			})
		} else {
			_do_spawn(self, root, config, cb);
		}

	})
}

function _do_spawn(self, root, config, cb){
	var gate = Gate.create();
	var actions_dir = path.resolve(root, 'actions');
	if (_DEBUG) console.log('making action dir %s with config %s', actions_dir, util.inspect(config));
	mkdirp(actions_dir, function (err) {
		if (config.actions) {
			_.each(config.actions, function (action) {
				_spawn_action(self, root, action, gate.latch());
			})
		} else {
			_spawn_action(self, root, 'home', gate.latch());
		}
		gate.await(cb);
	})
}

module.exports = function (root, config, cb) {

	if (_DEBUG) console.log('spawning %s', root);

	var self = this;
	if (_.isArray(config)) {
		config = {
			actions: config
		}
	}

	if (config.reset){
		delete config.reset;
		rmdir(root, function(err){
			if (err){
				return cb(err);
			}
			_spawn(self, root, config, cb);
		})
	} else {
		_spawn(self, root, config, cb);
	}
}