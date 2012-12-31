var mvc = require('./../index');
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;
var fs = require('fs');

var apiary = mvc.Apiary({}, __dirname);
apiary.init(function(){

	tap.test('adding resource', function(t){
		apiary.Resource({TYPE: 'foo_resource', name: 'foo1'}, {}, function(err, foo1){
			foo1.init(function(){
				t.equals(foo1.name, 'foo1', 'foo1 created');
				apiary.Resource({TYPE: 'foo_resource', name: 'foo2'}, {}, function(err, foo2){
					foo2.init(function(){
						if (_DEBUG)	console.log('resource list: %s', util.inspect(Resource));
						var foo_resources = apiary.Resource.list.resource('foo_resource');
						t.equals(foo_resources.length, 2, 'found 2 foo_resources');
						var names = _.sortBy(_.pluck(foo_resources, 'name'), _.identity);
						t.deepEqual(names, ['foo1', 'foo2'], 'names of foo resources');
						t.end();
					});
				})
			})
		})
	});

})
