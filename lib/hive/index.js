var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');

var _mixins = {

	actions: [],

	serve: function(app,cb){
		
	},

	load: require('./load')

};

module.exports = function(mixins, config, callback){
	if (_.isString(config)){
		config = {
			root: config
		};
	}
	return Component([mixins, _mixins], config, callback);

};

module.exports.spawn = require('./spawn')