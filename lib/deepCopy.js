// Create a cyclical deepCopy of an object
// Inteded to be used with objects that
// will later be cyclicalJSON.stringif[ied]
// Note that instances of
// String, Number, Boolean, RegExp, Date, and Function
// will pass through.
// This is fine behavior for JSON,
// however it is not a true deepCopy

const shouldPassThrough = require('./shouldPassThrough');

const copy = weakMap => value => {
	const replication = value instanceof Array ? [] : {};

	if (shouldPassThrough(value)) {
		return value;
	}
	if (weakMap.has(value)) {
		return weakMap.get(value);
	}

	weakMap.set(value, replication);

	return Object.keys(value).reduce((replica, key) => {
		replica[key] = copy(weakMap)(value[key]);

		return replica;
	}, replication);
};

module.exports = function (value) {
	return copy(new WeakMap)(value);
};
