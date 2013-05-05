var Gate = require('gate');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var util = require('util');
var _DEBUG = false;

/* ******* CLOSURE ********** */

/* ******** EXPORTS ************** */

module.exports = function (apiary) {

	var static_file = require('./static_file_from_url')(apiary);

	return function (req, res, next) {
		//console.log('Static.resolve: req %s', util.inspect(req));
		var url = req.url;

		static_file(url, function(err, file){

			if (file){
				res.sendfile(file);
			} else {
				next();
			}
		});
	}
};