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
	var conf = {
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
		conf[opt] = o[opt];
	
	if (typeof conf.startPage === 'string')
		conf.startPage = url.parse(conf.startPage);
	
	// Makes a request to the provided URL and handles the response
	this.request = function(u) {
		if (typeof u === 'string') {
			u = url.parse(u);
		}
		
		var opts = {
			'hostname' : u.hostname,
			'path' : u.path,
			'method' : 'GET',
			'headers' : {}
		};
		
		if (conf.auth)
			opts.auth = conf.auth;
		
		var requester = http;
		if (u.protocol == 'http:') {
			opts.port = conf.ports.http;
		} else if (u.protocol = 'https:') {
			opts.port = conf.ports.https;
			requester = https;
		}
		
		requester.request(opts, function(res) {
			var body = '';
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {
				if (res.headers['content-type'].indexOf('text/html') > -1) {
					jsdom.env(
						body,
						['http://code.jquery.com/jquery.js'],
						function(errors, window) {
							if (errors) {
								console.log("errors: " + errors);
							}
							
							// Gather a list of stylesheet elements and other non-<a> tags
							var stylesheets = window.$('[rel="stylesheet"]');
							var images = window.$('img');
							var scripts = window.$('script');
							var sources = [];
							
							// Gather a list of sources
							for (var s in stylesheets) {
								if (typeof stylesheets[s].href === 'string') {
									sources.push(url.parse(stylesheets[s].href));
								}
							}
							
							for (var i in images) {
								if (typeof images[i].src === 'string') {
									sources.push(url.parse(images[i].src));
								}
							}
							
							for (var s in scripts) {
								if (typeof scripts[s].src === 'string') {
									sources.push(url.parse(scripts[s].src));
								}
							}
							
							// Remove sources not based on this host
							for (var s = 0; s < sources.length; ++s) {
								if (sources[s].hostname != null && sources[s].hostname != conf.startPage.hostname) {
									sources.splice(s, 1);
									--s;
								}
							}

						}
					);
				}
			});
			res.on('error', function(e) {
				console.log(e);
			});
		}).end();
	};
}
