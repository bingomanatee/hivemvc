var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp')
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var _script_template_path = path.resolve(__dirname, '_action_template.js');
fs.exists(_script_template_path, function(ex){
	if (!ex) throw new Error("script template " + _script_template_path + ' does not exist');
});

var _routes = function (name) {
	return  {
		get:    ['*/' + name],
		put:    ['*/' + name],
		post:   ['*/' + name],
		delete: ['*/' + name]
	};
};

/* ********* EXPORTS ******** */

module.exports = function (action_path, name, cb, config) {
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