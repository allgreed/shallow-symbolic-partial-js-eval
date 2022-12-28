.PHONY: run
run: install
	npx ts-node index.ts

install: node_modules

node_modules: yarn.lock
	yarn install --frozen-lockfile
