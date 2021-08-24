all: public/bulma.min.css public/qr-scanner-worker.min.js

public/bulma.min.css: node_modules/bulma/css/bulma.min.css
	cp $< $@

public/qr-scanner-worker.min.js: node_modules/qr-scanner/qr-scanner-worker.min.js
	cp $< $@
