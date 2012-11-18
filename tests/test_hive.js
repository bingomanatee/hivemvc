var Hive = require('./../index').Hive;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;

tap.test('write hive action', function (t) {

	var spawn_target = path.resolve(__dirname, '../test_resources/spawn');

	Hive.spawn(spawn_target, {reset: true, actions: ['foo', 'bar']}, function(err, result){
		if (err){
			console.log(err);
		}
		t.end();
	})

})