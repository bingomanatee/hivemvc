console.log('loading hive-mvc');

module.exports = {
	Action:   require('./lib/action'),
	Tree:     require('./lib/tree'),
	Model:    require('./lib/model'),
	Hive:     require('./lib/hive'),
	Resource: require('./lib/resource'),
	Static:   require('./lib/static')
}