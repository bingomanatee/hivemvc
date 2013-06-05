var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;

function _listen(self) {
	var apiary = self.get_config('apiary');
	var routes = self.get_config('routes');
	if (_DEBUG) console.log('... routes: %s', util.inspect(routes));

	var static_map = self.get_config('static');
	if (static_map) {
		_.each(static_map, function(uri, folder){
			if (_DEBUG) 	console.log('>>>>>>>>>> parsin folder %s as  uri %s', folder, uri);
			var parsed_uri = this.parse_route(uri);
			if (_DEBUG) 	console.log('... to %s', parsed_uri);
			static_map[folder] = parsed_uri;
		}, self);
		self.static = apiary.Static({}, {map: static_map, root: path.resolve(self.get_config('root'), 'static')});
		self.static.init();
	} else {
		if (_DEBUG) console.log('no static map for %s', self.$root);
	}

	_.each(routes, function (route_paths, method) {
		method = method.toLowerCase();
		if (_.isString(route_paths)) {
			route_paths = [route_paths];
		}
		_.each(route_paths, function (route_path) {
			route_path = self.parse_route(route_path);
			if (_DEBUG) console.log('routing %s (%s)', route_path, method);

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