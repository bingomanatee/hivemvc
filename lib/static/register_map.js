var path = require('path');
var _DEBUG = true;
var util = require('util');
var _ = require('underscore');

var ar_re = /\*\/(.*)/;
module.exports =  function (callback){
	if (_DEBUG) console.log('register_map');
	var map = this.get_config('map');
	var root = this.get_config('root');
	var alias_root = this.get_config('alias_root');
	var self = this;

	if(_DEBUG) console.log('map: %s, root: %s', util.inspect(map), root);

	if (map && root){

		if (!_.isObject(map)){
			throw new Error('non object passed as map');
		}

		_.each(map, function (alias, prefix){
			var actual_directory = path.join(root, prefix);
			if (_DEBUG){
				console.log('register_map mapping %s to %s', alias, actual_directory);
			}
			if (ar_re.test(alias)){

				if (!alias_root){
					throw new Error('relative alias ' + alias + ' provided without an alias_root');
				}

				var alias_parts = ar_re.exec(alias);
				alias = path.resolve(alias_root, alias_parts[1]);
			}
			self.map(actual_directory, alias);
		});

	}

	callback();
}
