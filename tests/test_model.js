var Model = require('./../index').Model;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var Gate = require('gate');

var beta = {id: 2, name: 'beta', created: 200};
var gamma = {id: 3, name: 'gamma', created: 400};

var _model_mixin = {
	name: 'foo_model',
	data: [
		{id: 1, name: 'alpha', created: 100},
		beta,
		gamma,
		{id: 4, name: 'delta', created: 300},
		{id: 5, name: 'omega', created: 100}
	]

}

var rec_count = 50;

tap.test('get and put', function (t) {

	Model(_model_mixin, {_pk: 'id'}, function (err, model) {

		model.init(function () {
			model.get(3, function (err, record) {
				t.deepEqual(record, gamma, 'record id 3 == gamma');

				var fifi = {id: 6, name: 'fifi', created: 200};
				model.put(fifi, function (err, ff) {
					t.deepEqual(fifi, ff, 'fifi in == fifi out');
					model.get(6, function (err, ff3) {
						if (err) throw err;
						t.deepEqual(ff3, fifi, 'found fifi');

						model.count(function (err, c) {
							t.equal(c, 6, 'start with six records');

							model.delete(2, function (err, record) {
								t.deepEqual(record, beta, 'return from delete == beta');
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

tap.test('query', function (t) {

	Model(_model_mixin, {_pk: 'id'}, function (err, model) {

		model.init(function () {

			model.find({created: 100}, function (err, hits) {
				//console.log('hit on created:100 %s', util.inspect(hits));
				var names = _.sortBy(_.pluck(hits, 'name'), _.identity);
				t.deepEqual(names, ['alpha', 'omega'], 'found created at 100');
				t.end();
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
		return _.map(_.range(1, rec_count + 1), function (id) {
			var w = word();
			return {
				id:     id,
				name:   w,
				weight: Math.floor(1000 * Math.random())
			}
		})
	}

	var dump_path = path.resolve(__dirname, './../test_resources/model/dumper/data')

	Model({
		name: 'dumper',
		data: _make_dumper_data()
	}, {dump_path: dump_path}, function (err, dumper_model) {
		dumper_model.init(function () {

			dumper_model.dump(function (err, result) {
				if (err) {
					return t.end();
				}

				Model({
						name: 'dumper_loader'
					}, { dump_path: dump_path, dump_name: 'dumper'},
					function (err, dumper_loader_model) {
						dumper_loader_model.load(function (err) {
							if (err) {
								return t.end();
							}

							dumper_loader_model.count(function (err, c) {
								t.equals(c, rec_count, 'rec_count records uploaded');
								var gate = Gate.create();

								dumper_loader_model.all(function (err, data) {
									_.each(data, function (record) {
										var l = gate.latch();
										debugger;
										dumper_model.get(record.id, function (err, original) {
											if (err) {
												console.log('err: %s', err.message);
											}

											t.deepEqual(original, record, 'comparing dump record ' + record.id);
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

})