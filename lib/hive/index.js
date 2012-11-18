var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');

var _mixins = {

	serve: function(app,cb){
		
	}

};

module.exports = function(mixins, config, callback){
	_.defaults(mixins, _mixins);
	Component(mixins, config, function(err, hive){
		if (err){
			return callback(err);
		}

		var root = hive.get_config('root');
		fs.exists(root, function(ex){
			if (ex){
				callback(null, hive);
			} else {
				callback(new Error('cannot find hive root ' + root));
			}
		})
	});

};

module.exports.spawn = require('./spawn')