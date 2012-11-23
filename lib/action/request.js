var _ = require('underscore');
var Context = require('./../context');

module.exports = function(req, res, next){
	var self = this;
	var ctx = Context(req, res, this);

	this.ready(function(ctx, cb){

		self.respond(ctx, function(err, ctx, output){
			if (err){

				if (err.message=='unready'){
					ctx.$res.sendfile(__dirname + 'not_ready.html')
				} else {
					next(err);
				}

			} else {
				if (_.isObject(output)){
					res.send(output);
				} else {
					rs.send(200, output);
				}
			}
		})

	});

};