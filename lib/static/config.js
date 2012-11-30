var _register_map = require('./register_map');

/**
 *
 * The purpose of static directories is to warehouse static resources - images, CSS, and other client side resources -
 * in "virtual directories". A virtual directory is a combination of an alias - that is, a www path in which all its
 * contents are found - and an actual file path, where the directory lives in your server.
 *
 * Static file collections have these elements:
 *   1) a root directory (usually .../static) in which all the static subdirectires are found
 *   2) a map collection of prefix => alias associations
 *   3) an alias_root prepended to some aliases.
 *
 * @type {Object}
 */

module.exports = {

	init_tasks: [
		_register_map
	]

}