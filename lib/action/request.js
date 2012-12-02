var _ = require('underscore');
var Context = require('./../context');
var Resource = require('./../resource');

module.exports = function(req, res, next){
	var self = this;
	var ctx = Context(req, res, this);

	this.ready(ctx, function(err, ready){
		if (err){
			return next(err);
		} else if (!ready){
			return ctx.$res.sendfile(__dirname + 'not_ready.html')
		}
		self.respond(ctx, function(err, ctx, output){
			if (err){

				if (err.message=='unready'){
					return ctx.$res.sendfile(__dirname + 'not_ready.html');
				} else {
					next(err);
				}

			} else {
				if (_.isObject(output)){
					if (ctx.$template){
						Resource.list.find({TYPE: 'view_helper'}, function(err, helpers){
							res.render(template, output);
						});
					} else {
						res.send(output);
					}

				} else {
					rs.send(200, output);
				}
			}
		})
	})

};