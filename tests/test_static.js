var tap = require('tap');
var Static = require('./../index').Static;
var path = require('path');
var sf_root = path.resolve(__dirname, '../test_resources/static_files')
var Model = require('./../index').Model;
var files = Model.list.get('_static_files');

var action_one_static = Static({}, {
	map:  {bar: '/alpha/bar', foo: '/alpha/foo'},
	root: path.resolve(sf_root, 'action_1/static')
});

var action_two_static = Static({}, {
	map:  {foobar: '/alpha/foo/bar'},
	root: path.resolve(sf_root, 'action_2/static')
});

action_one_static.init(function () {
	action_two_static.init(function () {

		tap.test('mapping and finding static files', function (t) {

			Static.resolve({url: '/alpha/bar/c.txt'}, {

				sendfile: function (file) {
					console.log('sent file: %s', file);
					t.ok(file.search('static_files/action_1/static/bar/c.txt'))
					files.get( '/alpha/bar/c.txt', function(err, hit){
						t.ok(hit, 'file is now in files db');
					 if (hit)	t.equals(hit.path, file, 'file in DB has expected path');
						t.end();
					})
				}

			}, function () {
				t.ok(false, 'cannot resolve /alpha/bar/c.txt');
				t.end();
			})

		})

		tap.test('conflicting static files', function (t) {

			Static.resolve({url: '/alpha/foo/bar/c.txt'}, {

				sendfile: function (file) {
					console.log('sent file: %s', file);
					t.ok(file.search('static_files/action_2/static/foobar/c.txt'))
					t.end();
				}

			}, function () {
				t.ok(false, 'cannot resolve /alpha/foo/bar/c.txt');
				t.end();
			})

		})

		tap.test(function (t) {

			Static.resolve({url: '/we/have/no/file/like/this'}, {
					sendFile: function (file) {
						t.ok(false, 'file /we/have/no/file/like/this sent');
						t.end();
					} },
				function () {
					t.ok(true, 'file /we/have.. skipped');
					t.end();
				})

		})
	})
});