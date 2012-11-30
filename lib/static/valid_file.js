var fs = require('fs');

module.exports = function(file){

	var time = new Date().getTime();
	// accepting validation checks within 20 seconds
	if ((time - file.validated) < this.get_config('revalidation_time', 20 * 1000)){
		return true;
	}

	if (fs.existsSync(file.path)){
		file.validated = time;
		return true;
	} else {
		this.delete(file);
		return false;
	}

};