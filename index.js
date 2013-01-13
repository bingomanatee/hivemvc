module.exports = {

	Apiary: require('./lib/apiary'),
	spawn:  require('./lib/spawn'),

	handlers: {
		resources: require('./lib/handlers/resources_handler')
	}

};