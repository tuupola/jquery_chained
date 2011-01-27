VERSION = 0.9.0
SHELL = /bin/sh
DOWNLOAD = /var/www/www.appelsiini.net/htdocs/download
JSPACKER = /home/tuupola/bin/jspacker
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

