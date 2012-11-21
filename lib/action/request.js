var _ = require('underscore');

module.exports = function(req, res){
	var self = this;
	var ctx = {req: req, res: res};
	this.respond(ctx, function(err, ctx, output){
		if (err){
			this.emit('response_error', ctx, err);
		} else {
			if (_.isObject(output)){
				res.send(output);
			} else {
				rs.send(200, output);
			}
		}
	})
}