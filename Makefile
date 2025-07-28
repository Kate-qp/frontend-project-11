develop:
	npx webpack serve --config webpack.config.js

install:
	npm ci

build:
	set NODE_ENV=production && npx webpack --config webpack.config.js

test:
	npm test

lint:
	npx eslint .

.PHONY: test
