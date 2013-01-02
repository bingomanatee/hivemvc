var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var _mixins = require('./mixins');
var _DEBUG = false;

function _load(cb) {
	if (_DEBUG) console.log('loading frame %s with callback ', this.get_config('root'), cb.toString());

	var self = this;
	var lto = setTimeout(function () {
		console.log('hanging timeout for %s', self.get_config('root'));
	}, 4000);
	this.load(function () {
		clearTimeout(lto);
		cb();
	});
}

/** *******************************************
 *
 * this is a mixin that embeds a Frame factory into the apiary.
 *
 * @param apiary: Apiary
 * @param callback: function
 */

module.exports = function (apiary, callback) {

	function _enlist(cb) {
		if (_DEBUG) console.log('_enlisting frame %s', this.get_config('root'));

		var root = this.get_config('root');
		if (!root) {
			throw new Error('attempting to index frame - no root');
		}
		this.$root = root;

		var existing_frame = Frame.list.get(root);
		if (existing_frame) {
			throw new Error('redundant frame for root %s', root);
		}

		Frame.list.put(this);
		cb();
	}

	function _emit(cb) {
		apiary.emit('frame', this);
		cb();
	}

	function Frame(root) {
		return Component(_mixins, [
			{root: root},
			{
				apiary: apiary,
				init_tasks: [
					_load,
					_enlist,
					_emit
				]
			}
		]);
	}


	Frame.list = apiary.Model({name: '$frames', _pk: '$root'}, {}, function(){
		apiary.Frame = Frame;
		callback();
	});

}
