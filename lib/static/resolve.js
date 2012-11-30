var Model = require('./../model');
var files = Model.list.get('_static_files');
var prefixes = Model.list.get('_static_prefixes');
var Gate = require('gate');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var util = require('util');
var _DEBUG = false;

function _map_file(url, prefix, cb) {
	var alias = prefix.alias;
	var f_prefix = prefix.prefix;
	if (_DEBUG) {
		console.log('Static.resolve: x`checking map prefix %s, alias %s', f_prefix, alias);
	}
	var url_suffix = url.slice(alias.length);
	var mapped_file = path.join(f_prefix, url_suffix);
	if (_DEBUG) {
		console.log('Static.resolve: checking existence of %s based on %s and %s', mapped_file, f_prefix, url_suffix);
	}
	fs.exists(mapped_file, function (exists) {
		if (exists) {
			cb(null, {path: mapped_file, strength: alias.length})
		} else {
			cb();
		}
	})
}

module.exports = function (req, res, next) {
	//console.log('Static.resolve: req %s', util.inspect(req));
	var url = req.url;
	var self = this;

	files.get(url, function (err, file) {

		if (file && files.valid(file)) {
			return res.sendfile(file.path, null, null, file); // sending the file record back - mainly for unit testing validation
		}

		prefixes.find(function (prefix, cb) {
			if (_DEBUG) {
				console.log('Static.resolve: comparing prefix alias %s to url %s', util.inspect(prefix.alias), url);
			}
			var hit = url.indexOf(prefix.alias) == 0;
			return hit;
		}, function (err, matches) {
			if (_DEBUG) {
				console.log('Static.resolve: match result: %s', util.inspect(matches));
			}
			var gate = Gate.create();
			_.each(matches, function (prefix) {
				_map_file(url, prefix, gate.latch());
			})
			gate.await(function (err, matches) {
				if (_DEBUG) {
					console.log('Static.resolve: matches: %s', util.inspect(matches));
				}
				var hits = _.reduce(matches, function (hits, hit) {
					if (hit[1]) {
						hits.push(hit[1]);
					}
					return hits;
				}, []);

				var shits = _.sortBy(hits, 'strength');
				if (shits.length){
					var hit = shits.pop();
					files.put({url: url, path: hit.path, validated: new Date().getTime()}); // note - not waiting for return from DB;
					res.sendfile(hit.path);
				} else {
					next();
				}
			})
		})
	})
}