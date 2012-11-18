var Model = require('./../index').Model;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var Gate = require('gate');

tap.test('get and put', function (t) {

	var beta = {id: 2, name: 'beta', created: 200};
	var gamma = {id: 3, name: 'gamma', created: 100};
	Model({
		name: 'foo_model',
		data: [
			{id: 1, name: 'alpha', created: 100},
			beta,
			gamma,
			{id: 4, name: 'delta', created: 300},
			{id: 5, name: 'omega', created: 100}
		]

	}, {pk: 'id'}, function (err, model) {

		model.init(function () {
			model.get(3, function (err, record) {
				t.deepEqual(record, gamma, 'record id 3 == gamma');

				var fifi = {id: 6, name: 'fifi', created: 200};
				model.put(fifi, function (err, ff) {
					model.get(6, function (err, ff3) {
						t.deepEqual(ff3, fifi, 'found fifi');

						model.count(function (err, c) {
							t.equal(c, 6, 'start with six records');

							model.delete(2, function (err, record) {
								t.deepEqual(record, beta);
								model.count(function (err, c2) {
									t.equal(c2, 5, 'after delete, five records left');
									t.end();
								})
							})
						})
					})
				});
			})
		})
	})
});

var alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
var word = function () {
	var letters = [];
	do {
		letters.push(_.shuffle(alpha).slice(0, 2))
	} while (Math.random() > 0.25);
	return _.flatten(letters).join('').slice(0, 8);
}

tap.test('dump data', function (t) {

	function _make_dumper_data() {
		return _.map(_.range(1, 51), function (id) {
			return {
				id:     id,
				name:   word(),
				weight: Math.floor(1000 * Math.random())
			}
		})
	}

	var dump_path = path.resolve(__dirname, './../test_resources/model/dumper/data')

	Model({
		name:  'dumper',
		_data: _make_dumper_data()
	}, {dump_path: dump_path}, function (err, dumper_model) {
		dumper_model.dump(function (err, result) {
			if (err) {
				console.log('error from dump: %s', err.message);
				return t.end();
			}

			Model({
					name: 'dumper'
				}, { dump_path: dump_path},
				function (err, dumper_loader_model) {
					dumper_loader_model.load(function (err) {
						if (err) {
							console.log('error from load: %s', err.message);
							return t.end();
						}

						dumper_loader_model.count(function (err, c) {
							t.equals(c, 50, '50 records uploaded');

							var gate = Gate.create();

							dumper_loader_model.all(function (err, data) {

								_.each(data, function (record) {
									var l = gate.latch();

									dumper_model.get(record.id, function (err, original) {
										t.deepEqual(original, record, 'comparing record ' + record.id);
										l();
									})

								});

								gate.await(function () {
									t.end();
								})

							})

						})
					})
				})
		})
	})

})