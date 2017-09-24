all:
	npm run lint && \
	npm test && \
	rm -rf build && \
	npm run build && \
	npm run test-integration

reset:
	rm -rf node_modules && \
	npm install && \
	make all
