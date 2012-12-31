var util = require('util');
var tap = require('tap');
var _ = require('underscore');

/**
 *  FOUNDATION
 *
 * This is the base class for all classes below.
 *
 * @constructor
 */

function A_Doubler() {
    this.toString = function () {
        return 'A_Doubler';
    }
}

var _a_doubler_mixin = {
    a:               10
    /**
     * This is the only place the a_times_two method is defined.
     * HOWEVER the basis for this method, a, exists as a different value across all classes.
     */, a_times_two:function () {
        return this.a * 2
    }
}

_.extend(A_Doubler.prototype, _a_doubler_mixin);


/**
 *
 * OUR FIRST EXTENSION
 *
 * A_and_B_doubler extends A_Doubler through inherits.
 * @constructor
 */

function A_and_B_doubler() {
    this.toString = function () {
        return 'A_and_B_doubler';
    }
}
/**
 * A_and_B_doubler extends A_Doubler through inherits. This modifies its prototype property....
 *
 */
util.inherits(A_and_B_doubler, A_Doubler);

// THEN we use underscore's extend to further screw with A_and_B_doubler's prototype,
// adding b_times_two.
// We alwo override the value of a in prototype .

var _b_doubler_mixin = {
    b:3,
    a:4,
    b_times_two:function () {
        return this.b * 2;
    }
}

_.extend(A_and_B_doubler.prototype, _b_doubler_mixin)




/**
 * A_B_and_C_doubler is a parent class of A_and_B_doubler, thanks to inherits.
 * By extension it inherits the methods of A_Doubler that have been added to A_and_B_doubler via inherits.
 * Inside the constructor we reset the value of a to what ever is passed in.
 *
 * We add a thrid method in cab, c_times_two, and redefine its toString.
 *
 * @constructor
 */
function A_B_and_C_doubler(a) {
    this.a = a;
}

util.inherits(A_B_and_C_doubler, A_and_B_doubler);

var _c_mixin = {
    c:          4, c_times_two:function () {
        return this.c * 2;
    }, toString:function () {
        return 'A_B_and_C_doubler';
    }
};

_.extend(A_B_and_C_doubler.prototype, _c_mixin);




/**
 * B_doubler_but_no_A_doubler is an antipattern; we both alter the prototype with inherits and DEFINE it by straight assignation.
 * @constructor
 */

function B_doubler_but_no_A_doubler() {

}

util.inherits(B_doubler_but_no_A_doubler, A_Doubler);

// and now we undo our good work:

B_doubler_but_no_A_doubler.prototype = _.clone(_b_doubler_mixin); // a copy of _b_doubler_mixin


/**
 * Here's the same antipattern in reverse: this time we call inherits AFTER defining the prototype.
 * @constructor
 */
function A_Doubler_but_no_B_Doubler() {

}

_.extend(B_doubler_but_no_A_doubler.prototype, _b_doubler_mixin);

/**
 * And now it is inherits doing the violence.
 */
util.inherits(A_Doubler_but_no_B_Doubler, A_Doubler);

module.exports =
{
    A_Doubler: A_Doubler,
    A_and_B_doubler: A_and_B_doubler,
    A_Doubler_but_no_B_Doubler: A_Doubler_but_no_B_Doubler,
    B_doubler_but_no_A_doubler: B_doubler_but_no_A_doubler,
    A_B_and_C_doubler: A_B_and_C_doubler
};
