var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var async = require('async');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = {
	TYPE: 'apiary',

	load_frames: function (root, callback) {
		var frames_loader = require('./../loaders/frames_loader');
		var fl = frames_loader(root);

		if (this.has_config('frame_filter')){
			var ff = this.get_config('frame_filter');
			fl.test = function(file){
				return _.contains(ff, file);
			}
		}

		fl.core(this);
		fl.load(callback);
	},

	add_model: function (model) {
		return this.dataspace.add(model);
	},

	model: function (name) {
		return this.dataspace.get_config(name);
	},

	has_model: function (name) {
		return this.dataspace.has_config(name);
	},

	exec_mixins: function(callback, for_server){
		function is_server(mixin){ return mixin.for_server; }

		var mixins = this.get_config('mixins') || []
		mixins = for_server ? _.filter(mixins, is_server) : _.reject(mixins, is_server);

		if (!mixins.length){
			return callback();
		}

		mixins = _.sortBy(mixins, 'weight');

        var self = this;

		var series_functions = mixins.map(function(mixin){

			return function(cb){
				mixin.respond( function(err){
                    self.emit('mixin', mixin.name, err);
					if (err){
						cb(err);
					} else {
						cb();
					}
				})
			}

		});
		//@TODO replace with pluck for respond?

		async.series(series_functions, callback);

	},

	serve: function (app, server) {
		this.emit('app', app);
		this.app = app;
		this.server = server;
		app.use(this.Static.resolve);

		var self = this;

		function _after_mixins(err, results){
			if (err){
				throw err;
			}
			self.serve_actions(app, server);
		}

		this.exec_mixins(_after_mixins, true);
	},

	serve_actions: function(app, server){

		function _serve(action) {
			if (!action.TYPE == 'action') {
				throw new Error(util.format('non_action in actions list: %s', util.inspect(action)));
			}
			action.serve(app);
		}

		this.on_action(_serve);
	},

	close: function (cb) {
		if (this.server){
			this.server.close(cb);
		}
	},

	/**
	 * These methods apply a handler to all known and future instnaces of a given resource type
	 * @param fn
	 */

	_on: function (trigger, fn, model) {
		this.on(trigger, fn);
		if (model) {
			model.all(function (err, items) {
				items.forEach(fn);
			});
		}
	},

	add_static: function (target, cb) {
		if (target.has_config('static')) {
			var st = target.get_config('static');
			if (_DEBUG) console.log('digesting static %s of root %s', util.inspect(st), target.get_config('root'));
			this.Static({}, {map: st, root: path.resolve(target.get_config('root'), 'static')}).init(cb);
		} else {
			if (_DEBUG) console.log('no static for %s', target.get_config('root'));
			cb();
		}
	},

	on_action: function (fn) {
		this._on('action', fn, this.Action.list);
	},

	on_frame: function (fn) {
		this._on('frame', fn, this.Frame.list);
	},

	on_hive: function (fn) {
		this._on('hive', fn, this.Hive.list);
	},

	on_resource: function (fn, type) {
		if (type) {
			var h = function (res) {
				if (res.TYPE == type) {
					fn(res);
				}
			}
			fn = h;
		}

		this._on(type, fn, this.Resource);
	}
};