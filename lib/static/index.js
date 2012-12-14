var Model = require('./../model');
var util = require('util');
var hc = require('hive-component');
var prefixes = Model({_pk: 'prefix', name: '_static_prefixes'});

console.log('put %s into %s', util.inspect(prefixes), util.inspect(Model.list));

var files = Model({_pk: 'url', name: '_static_files', valid: require('./valid_file')});
var _ = require('underscore');
var util = require('util');

module.exports = function (mixins, config, cb) {
	var _mixins = require('./mixins');
	var _config = require('./config');
	return hc([_mixins, mixins, {file_model: files, prefixes_model: prefixes}], [_config, config], cb);

};

module.exports.map = function (prefix, alias) {
	_mixins.map(prefix, alias);
}

module.exports.resolve = require('./resolve');