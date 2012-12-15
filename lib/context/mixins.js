var _ = require('underscore');
var path = require('path');

var _mixins = {

	$parse_body: require('./parse_body'),

	$go: function(url){
		this.$res.redirect(url);
	},

	$send: function(status, url){
		if (status && url){
			this.$res.send(status, url);
		} else if (url) {
			this.$res.send(url);
		} else {
			this.$res.send(status);
		}
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