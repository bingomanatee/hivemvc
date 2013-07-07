var util = require('util');
var _ = require('underscore');
_.str = require('underscore.string');
var events = require('events');
var Component = require('hive-component');
var model = require('hive-model');
var _mixins = require('./mixins');
var Gate = require('gate');
var _DEBUG = false;

function _load_frames(cb) {
	if (_DEBUG) console.log('apiary at load frames: %s', util.inspect(this, false, 0));
	this.load_frames(this.get_config('root'), function () {
		cb();
	});
}

function _init_model(cb) {
	this.dataspace = model.Dataspace(this);
	this.Model = model.Model.factory(this.dataspace);
	cb();
}

/** ****************** APIARY ***********************
 *
 * An apiary is the top level resource for a web application.
 *
 * The full genus is
 *
 * APIARY : FRAME : HIVE : ACTION
 *
 * Apiaries contain a dataspace, which is the domain for all models within the application,
 * ensuring that all models within an application have a unique name.
 *
 * @param config
 * @param root
 * @return Component:apiary
 * @constructor
 *
 */

function Apiary(config, root) {

	return Component(_mixins, [config, {root: root, mixins: [], init_tasks: [
		function(callback){
			require('./logger').call(this, callback)

		},
		_init_model,
		function (callback) {
			require('./../action')(this, callback)
		},
		function (callback) {
			require('./../hive')(this, callback)
		},
		function (callback) {
			require('./../resource')(this, callback)
		},
		function (callback) {
			require('./../frame')(this, callback)
		},
		function (callback) {
			require('./../static')(this, callback)
		},
		function (callback) {
			require('./../context')(this, callback)
		},
		_load_frames,
		function(callback){
			this.exec_mixins(callback);
		}
	]}]);
}

util.inherits(Apiary, events.EventEmitter);

module.exports = Apiary;