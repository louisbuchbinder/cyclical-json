module.exports = {
	concat: (key, sub) => key +
		(key.length === 1 ? '' : ',') +
		'["' + sub + '"]',

	parse: str => JSON
		.parse('[' + str + ']')
		.map(arr => arr[0])
};
