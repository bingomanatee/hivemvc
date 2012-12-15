/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, mvc = require('./../../index')
	, util = require('util')
	, path = require('path');

module.exports = function (port, cb) {

	var app, server;
	app = express();

	app.configure(function () {
		app.set('port', port || 3000);
		app.set('views', __dirname + '/views');
		//app.set('view engine', 'ejs');
		app.engine('html', require('ejs').renderFile);
		app.use(express.favicon());
		// app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		// app.use(require('less-middleware')({ src: __dirname + '/public' }));
		app.use(express.static(path.join(__dirname, 'public')));
		app.use(mvc.Static.resolve);
	});

	app.configure('development', function () {
		app.use(express.errorHandler());
	});

	app.get('/', routes.index);
	app.get('/users', user.list);

	server = http.createServer(app);
	server.on('close', function () {
		console.log('======== closing server');
	});

	server.listen(app.get('port'), function () {
		console.log("Express server listening on port " + app.get('port'));

		var frame = mvc.load_frames(path.join(__dirname, 'frames'), function(){
			mvc.serve(app);
			if (cb) {
				cb();
			}
		});
	});

	return server;
}