VERSION = 0.9.1
SHELL = /bin/sh
DOWNLOAD = /srv/www/www.appelsiini.net/shared/static/download
JSMIN    = /home/tuupola/bin/jsmin

all: chained minified latest

chained: jquery.chained.js
	cp jquery.chained.js $(DOWNLOAD)/jquery.chained-$(VERSION).js

minified: jquery.chained.js
	$(JSMIN) < jquery.chained.js > jquery.chained.mini.js 
	cp jquery.chained.mini.js $(DOWNLOAD)/jquery.chained-$(VERSION).mini.js

latest: jquery.chained.js jquery.chained.mini.js 
	cp jquery.chained.js $(DOWNLOAD)/jquery.chained.js
	cp jquery.chained.mini.js $(DOWNLOAD)/jquery.chained.mini.js

