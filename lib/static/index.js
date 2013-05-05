var util = require('util');
var _ = require('underscore');
var hc = require('hive-component');
var Gate = require('gate');

/** *******************************************
 *
 * this is a mixin that embeds a Frame factory into the apiary.
 *
 * @param apiary: Apiary
 * @param callback: function
 */

module.exports = function(apiary, callback){

	var _mixins = require('./mixins')(apiary);

	var gate = Gate.create();

	var prefixes = apiary.Model({
		_pk: 'prefix',
		name: '$static_prefixes'
	}, {}, gate.latch());

	var files = apiary.Model({
		_pk: 'url',
		name: '$static_files',
		valid: require('./valid_file')
	}, {}, gate.latch());

	 function Static(mixins, config, cb) {
		var _config = require('./config');
		return hc([_mixins, mixins, {file_model: files, prefixes_model: prefixes}], [{apiary: apiary}, _config, config], cb);
	}

	Static.file_from_url = require('./static_file_from_url')(apiary);

	Static.resolve = require('./resolve')(apiary);

	gate.await(function(){
		apiary.Static = Static;
		callback();
	});
};
