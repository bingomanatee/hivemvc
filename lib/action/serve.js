var _ = require('underscore')
var util = require('util');
var path = require('path');
var _DEBUG = true;

function _listen(self) {
	var hive_mvc = require('./../../index');
	var routes = self.get_config('routes');
	if (_DEBUG) {
		console.log('... routes: %s', util.inspect(routes));
	}
	var static = self.get_config('static');
	if (static) {
		self.static = hive_mvc.Static({}, {map: static, root: path.resolve(self.get_config('root'), 'static')});
		self.static.init();
	}

	_.each(routes, function (route_paths, method) {
		method = method.toLowerCase();
		if (_.isString(route_paths)) {
			route_paths = [route_paths];
		}
		_.each(route_paths, function (route_path) {
			if (_DEBUG) {
				console.log('routing %s (%s)', route_path, method);
			}
			self.app[method](route_path, _.bind(self.request, self));
		});
	});
}

module.exports = function (app) {
	if (app) {
		this.emit('serve', app);
		this.app = app;
		var self = this;
		process.nextTick(function () {
			_listen(self);
		})
	}
};