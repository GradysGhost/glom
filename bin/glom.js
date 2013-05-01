/* * * * *
 * glom.js
 * 
 *    glom is a program that simulates human internet usage to run load tests
 *    against an HTTP server and gather real values about what kind of load
 *    said server can withstand.
 * 
 *    This file is the primary entry point into this software. For details
 *    and documentation, visit GitHub: https://github.com/GradysGhost/glom
 * 
 *    For basic usage instructions, consult README.md
 * 
 * * */

var User = require('../lib/user.js').User;

var opt = require('optimist')
	.demand(['c', 's'])
	.argv;

var user = new User({
	'auth' : 'retardis:Decry celibacy!'
});

user.request('http://irc.gradysghost.info');