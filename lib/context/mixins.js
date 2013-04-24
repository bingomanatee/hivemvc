var _ = require('underscore');
var path = require('path');

var _mixins = {

	$parse_body: require('./parse_body'),

	$go: function(url, cb){
		this.$res.redirect(url);
		if (cb) cb('redirect');
	},

	$send: function(){
		var args = _.toArray(arguments);
		var cb;
		if(_.isFunction(_.last(args))){
			cb = args.pop();
		}
		if (!args.length){
			this.$res.send(this.$out.toJSON ? this.$out.toJSON : this.$out);
		} else {
			this.$res.send.apply(this.$res, args);
		}

		if (cb) cb('json');
	},

	$sendfile: function(file_path, cb){
		this.$res.sendfile(file_path);
		if (cb) cb('redirect');
	},

	$render: require('./render'),

	$flash: function(type, msg){
		this.$req.flash(type, msg);
	},

	$phase: function(){
		if (this.$phases.length){
			return _.last(this.$phases);
		} else {
			return 'UNKNOWN';
		}
	}

};

_.extend(_mixins, require('./session'));

module.exports = _mixins;