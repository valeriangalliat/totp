all: public/bulma.min.css public/qr-scanner-worker.min.js

public/bulma.min.css: node_modules/bulma/css/bulma.min.css node_modules/bulma-responsive-form-addons/bulma-responsive-form-addons.css
	cat $^ > $@

public/qr-scanner-worker.min.js: node_modules/qr-scanner/qr-scanner-worker.min.js
	cp $< $@

serve:
	cd public && python3 -m http.server 8888
