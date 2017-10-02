module.exports = {
	extends: 'flickr',
	parserOptions: {
		ecmaVersion: '2015'
	},
	globals: {
		WeakMap: true
	},
	env: {
		node: true
	},
	rules: {
		'no-nested-ternary': 0
	}
};
