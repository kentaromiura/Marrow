
all: test build-src build

build-src:
	@if [ ! -d Build ]; then mkdir Build; fi
	@npm install
	@./node_modules/wrapup/bin/wrup.js -r ./Source/index.js > Build/Marrow.js
	@echo "Browser version written to 'Build/Marrow.js'"


test:
#	@make install
#	@./node_modules/mocha/bin/mocha Tests/index.js

install: package.json
	@npm prune
	@npm install

