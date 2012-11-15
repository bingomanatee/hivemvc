var Tree = require('./../index').Tree;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;

tap.test('adding children', function (t) {

	Tree({}, {}, function (err, tree) {

		tree.adopt([
			Tree({name: 'alpha', type: 'FOO'}),
			Tree({name: 'beta', type: 'BAR'}),
			Tree({name: 'gamma', type: 'FOO'})
		]);

		t.end();
	})

})