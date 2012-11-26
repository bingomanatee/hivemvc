var _ = require('underscore')
var util = require('util');

function _listen(self){
	var routes = self.get_config('routes');
	console.log('... routes: %s', util.inspect(routes));

	_.each(routes, function(route_paths, method){
		method = method.toLowerCase();
		if(_.isString(route_paths)){
			route_paths = [route_paths];
		}
		_.each(route_paths, function(route_path){
			self.app[method](route_path, _.bind(self.request, self));
		});
	});
}

module.exports = function(cb, app){
	if(app){
		this.emit('serve', app);
		this.app = app;
		var self = this;
		process.nextTick(function(){
			_listen(self);
		})
	}
	cb();
};