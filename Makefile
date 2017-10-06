all:
	npm run lint && \
	npm test && \
	rm -rf build && \
	mkdir build && \
	npm run build && \
	npm run test-integration && \
	npm run test-integration-min

reset:
	rm -rf node_modules && \
	npm install && \
	make all
