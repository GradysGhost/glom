/* * * * *
 * user.js
 * 
 *    glom simulates internet users. This object represents a single user and
 *    its behavior.
 * 
 * * */

// Other libs we need
var url		= require('url'),
	http	= require('http'),
	https	= require('https'),
	jsdom	= require('jsdom');

exports.User = function(o) {
	
	// Master config object for this User
	this.conf = {
		'delay' : 3,
		'concurrent' : 1,
		'startPage' : '',
		'ports' : {
			'http' : 80,
			'https' : 443
		},
		'auth' : ''
	};
	
	// Override the master config with custom options
	for (var opt in o)
		this.conf[opt] = o[opt];
	
	if (typeof this.conf.startPage === 'string')
		this.conf.startPage = url.parse(this.conf.startPage);
	
	// Makes a request to the provided URL and handles the response
	this.request = function(u) {
		if (typeof u === 'string') {
			u = url.parse(u);
		}
		
		var opts = {
			'hostname' : u.hostname,
			'path' : u.path,
			'method' : 'GET'
		};
		
		if (this.conf.auth)
			opts.auth = this.conf.auth;
		
		if (u.protocol == 'http:') {
			opts.port = this.conf.ports.http;
			http.request(opts, this.receiveResponse).end();
		} else if (u.protocol = 'https:') {
			opts.port = this.conf.ports.https;
			https.request(opts, this.receiveResponse).end();
		}
	};
	
	this.receiveResponse = function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', this.handleResponse(res, body));
		res.on('error', function(e) {
			console.log(e);
		});
	};
	
	this.handleResponse = function(res, body) {
		if (res.headers['content-type'].indexOf('text/html') > -1) {
			jsdom.env(
				body,
				['http://code.jquery.com/jquery.js'],
				function(errors, window) {
					if (errors) {
						console.log("errors: " + errors);
					}
					
					// Gather a list of elements with href or src attributes
					// that are not <a> tags
					var elems = window.$('[href], [src]', ':not(a)');
					var sources = [];
					for (var e in elems) {
						if (elems[e].src) {
							sources.push(url.parse(elems[e].src));
						}
						if (elems[e].href) {
							sources.push(url.parse(elems[e].href));
						}
					}
					
					// Remove sources not based on this host
					for (var s = 0; s < sources.length; ++s) {
						if (sources[s].hostname != null && sources[s].hostname != this.conf.startPage.hostname) {
							sources.splice(s, 1);
							--s;
						}
					}
					
					console.log(sources);
				}
			)
		}
	};
}