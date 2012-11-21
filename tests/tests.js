var _ = require('underscore');
var fs = require('fs');

fs.readdir(__dirname, function(err, files){
	files = _.reject(files, function(f){
		return (f == __filename) || (!/\.js$/.test(f))
	})

	files.forEach(function(file){
		var r_name = './' + file;
		console.log('requiring %s', r_name);
		require(r_name);
	})
});