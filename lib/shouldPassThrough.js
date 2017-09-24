module.exports = value => false ||
	typeof value !== 'object' ||
	value === null ||
	typeof value.toJSON === 'function' ||
	value instanceof String ||
	value instanceof Number ||
	value instanceof RegExp ||
	value instanceof Date ||
	value instanceof Boolean;
