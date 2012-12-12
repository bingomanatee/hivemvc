var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var mkdirp = require('mkdirp')
var Gate = require('gate');
var _DEBUG = false;
var rmdir = require('rmdir')

var _routes = function (name) {
	return  {
		get:    ['*/' + name],
		put:    ['*/' + name],
		post:   ['*/' + name],
		delete: ['*/' + name]
	};
}

var _script_template_path = path.resolve(__dirname, '_action_template.js');
fs.exists(_script_template_path, function(ex){
	if (!ex) throw new Error("script template " + _script_template_path + ' does not exist');
})
function _spawn_action_dir(action_path, name, cb, config) {
	var args = _.toArray(arguments);
	if (_DEBUG) console.log('_spawn_action_dir(%s)', util.inspect(args));
	if (!config) {
		config = {
			name:   name,
			routes: _routes(name)
		}
	} else if (!config.routes) {
		config.routes = _routes(name)
	}

	action_path = path.resolve(action_path, name);
	mkdirp(action_path, function (err) {
		if (err) {
			return cb(err);
		}

		var config_path = path.resolve(action_path, name + '_config.json');
		if (_DEBUG) console.log('writing %s to %s', util.inspect(config), config_path);
		var config_json;
		try {
			config_json = JSON.stringify(config, true, 4);
		} catch (err) {
			return cb(err);
		}
		fs.writeFile(config_path, config_json, function (err) {
			if (err) {
				console.log('error writing config:', err);
				return cb(err);
			}

			var script_path = path.resolve(action_path, name + '_action.js');
			var write_stream = fs.createWriteStream(script_path);
			var read_stream = fs.createReadStream(_script_template_path);
			read_stream.pipe(write_stream);
			read_stream.on('end', function(){
				cb();
			})

		})

	})
}

function _spawn_action(self, root, action, cb) {
	var args = _.toArray(arguments);
	if (_DEBUG) console.log('_spawn_action(%s)', util.inspect(args));
	var action_dir = path.resolve(root, 'actions');
	if (_DEBUG) console.log('_spawn_action for action dir %s', action_dir);

	if (_.isObject(action)) {
		_spawn_action_dir(action_dir, action.name, cb, action);
	} else {
		_spawn_action_dir(action_dir, action, cb);
	}
}

function _spawn(self, root, config, cb) {


	fs.exists(root, function (e) {
		if (!e) {
			mkdirp(root, function (e) {
				if (e) {
					return cb(e);
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
			_spawn_action(self, root, 'home', gete.latch());
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
				console.log('rmdir err', err);
				return cb(err);
			}
			_spawn(self, root, config, cb);
		})
	} else {
		_spawn(self, root, config, cb);
	}
}