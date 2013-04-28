var _ = require('underscore');
var path = require('path');
var Configuration = require('hive-configuration');

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
			if (!this.$out) {
				return cb(new Error('no output to send'));
			}
			var output = (this.$out instanceof Configuration) ? this.$out.valueOf() : this.$out.toJSON ? this.$out.toJSON() : this.$out;
			this.$res.send(output);
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