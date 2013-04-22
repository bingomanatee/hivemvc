var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Gate = require('gate');
var _DEBUG = false;

/* ************************************
 * returns a static file path for a given URL if one exists.
 * ************************************ */

/* ******* CLOSURE ********* */


/* ********* EXPORTS ******** */

module.exports = function (apiary) {

	function _find_file_in_static_directory(url, prefix, cb) {

		var alias = prefix.alias;
		var f_prefix = prefix.prefix;

		var url_suffix = url.slice(alias.length);
		var mapped_file = path.join(f_prefix, url_suffix);

		fs.exists(mapped_file, function (exists) {
			if (exists) {
				cb(null, {path: mapped_file, strength: alias.length})
			} else {
				cb();
			}
		})
	}

	function _file_record(url, hit){
		 return {url: url, path: hit.path, validated: new Date().getTime()}
	}

	return function (url, callback) {
		if (_DEBUG) console.log('looking for url %s', url);

		var files = apiary.model('$static_files');
		var prefixes = apiary.model('$static_prefixes');

		files.get(url, function (err, file) {

			if (file && files.valid(file)) {
				 callback(null, file.path, file); // sending the file record back - mainly for unit testing validation
			} else {

				function _on_file_match(err, matches) {
					if (_DEBUG) console.log('url: %s, matches: %s', url, util.inspect(matches));

					var gate = Gate.create();
					
					_.each(matches, function (prefix) {
						_find_file_in_static_directory(url, prefix, gate.latch());
					});
					
					gate.await(function (err, matches) {

						var hits = _.reduce(matches, function (hits, hit) {
							if (hit[1]) {
								hits.push(hit[1]);
							}
							return hits;
						}, []);

						var shits = _.sortBy(hits, 'strength');

						if (shits.length) {
							var hit = shits.pop();
							if (_DEBUG) console.log('hit: %s', hit.path);
							var file = files.put(_file_record(url, hit)); // note - not waiting for return from DB;
							callback(null, hit.path, file);
						} else {
							callback(null, null);
						}
					})
				}
				
				prefixes.find(function (prefix) {
					return url.indexOf(prefix.alias) == 0;
				}, _on_file_match)
			}
			
		})
	}
}; // end export function
