var Model = require('./../index').Model;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');

tap.test('get and put', function (t) {

	var gamma = {id: 3, name: 'gamma', created: 100};
	Model({
		name: 'foo_model',
		data: [
			{id: 1, name: 'alpha', created: 100},
			{id: 2, name: 'beta', created: 200},
			gamma,
			{id: 4, name: 'delta', created: 300},
			{id: 5, name: 'omega', created: 100}
		]

	}, {pk: 'id'},  function (err, model) {

		model.init(function(){
			model.get(3, function (err, record) {
				console.log('err: ', err);
				t.deepEqual(record, gamma, 'record id 3 == gamma');

				var fifi = {id: 6, name: 'fifi', created: 200};
				model.put(fifi, function(err, ff){
					model.get(6, function(err, ff3){
						t.deepEqual(ff3, fifi, 'found fifi');
						t.end();
					})
				});

			})
		})

	})

})