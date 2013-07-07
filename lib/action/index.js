var Component = require('hive-component');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

function _load(cb) {
	var self = this;
	var lto = setTimeout(function () {
	if (_DEBUG)	console.log('hanging timeout for %s', self.get_config('root'));
	}, 2000);

	this.load(function () {
		clearTimeout(lto);
		if (_DEBUG)	console.log('done with loading action');
		cb();
	});
}

/** *******************************************
 *
 * this is a mixin that embeds an Action factory into the apiary.
 *
 * @param apiary: Apiary
 * @param callback: function
 */

module.exports = function (apiary, callback) {

	var _mixins = require('./mixins')(apiary);
	function _emit(cb) {
		if (_DEBUG)  console.log('emitting action %s', this.get_config('root'));

		apiary.emit('action', this);
		cb();
	}

	function _path(root){
		var a_root = apiary.get_config('root');
		if (root.substring(0, a_root.length) == a_root){
			return root.substring(a_root.length);
		} else {
			return root;
		}
	}

	function _enlist(cb) {
		if (_DEBUG) console.log('enlisting action');

		var root = this.get_config('root');
		if (!root) {
			if (_DEBUG) console.log('attempting to enlist action - no root');
			root = this.component_id; // gotta have something...
		}
		this.$root = root;
		this.$path = _path(root);

		var existing_action = Action.list.get(root);
		if (existing_action) {
			throw new Error('redundant action for root %s', root);
		}

		Action.list.put(this, function(){
			cb();
		});
	}

	var _action_suffix = _.template(' -- action <%= $path %>')

	function _log(done){
		this.on('log', function(type, message){
			var apiary = this.get_config('apiary');

			if (!apiary) {
				return;
			}

			var self = this;

			try {

			function _stamp_message(msg){
				if (!msg){
					msg = '';
				}

				return msg + _action_suffix(self);
			}

			if (!message){
				if (type){
					type = _stamp_message(type);
				}
			} else {
				message = _stamp_message(message);
			}

			apiary.emit('log', type, message);

			} catch(err){
				console.log('log error: %s %s %s', err, type, message);
			}
		});

		done();
	}

	function Action(mixins, config) {
		if (_DEBUG) console.log('creating action with config %s', config);

		return Component(
			[mixins, _mixins]
			, [config, {apiary: apiary, init_tasks: [
			    _log,
				_load,
				_enlist,
				_emit]}]
		);
	}

	Action.list =  apiary.Model({name: '$actions', _pk: '$path'}, {}, function(){
		if (_DEBUG) console.log('action list makde');
		apiary.Action = Action;
		callback();
	});

};