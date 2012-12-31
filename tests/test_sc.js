var util = require('util');
var tap = require('tap');
var _ = require('underscore');

/**
 * This test is a proof of the difference between
 * the util.inherits and the "ad hoc" method of mixing in
 * via extending the prototype.
 *
 */

var abc = require('./../test_resources/abc');

tap.test('basic a doubler functionality', function(t){
    var a = new abc.A_Doubler();
    t.equals(a.a_times_two(), 20, 'a: a times two');

    t.equals(a.toString(), 'A_Doubler');

    t.end();
})


tap.test('single inheritance: a and b', function(t){

    var ab = new abc.A_and_B_doubler();

    t.equals(ab.a_times_two(), 8, 'ab: a times two');

    t.equals(ab.b_times_two(), 6, 'ab: b times two');

    t.end();

})

tap.test('double inheritance: a, b and c', function(t){

    var cab = new abc.A_B_and_C_doubler(7);

    t.equals(cab.a_times_two(), 14, 'cab: a times two; a value injected through constructor');

    t.equals(cab.b_times_two(), 6, 'cab: b times two');

    t.equals(cab.c_times_two(), 8, 'cab: c times two');

    t.end();
})


tap.test('b doubler mixed in, a doubler lost', function(t){

    var b_no_a = new abc.B_doubler_but_no_A_doubler();

    t.notOk(b_no_a.a_times_two, 'we blew away the inherits functionality');

    t.equals(b_no_a.b_times_two(), 6, 'b no a: b times two');

    t.end();
})

tap.test('a doubler mixed in, b doubler lost', function(t){

    var a_no_b = new abc.A_Doubler_but_no_B_Doubler();

    t.notOk(a_no_b.b_times_two, 'a no b we blew away the mixed in functionality');

    t.equals(a_no_b.a_times_two(), 20, 'a no b: b times two');

    t.end();
})
