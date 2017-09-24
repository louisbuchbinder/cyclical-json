// Create a cyclical deepCopy of an object
// Inteded to be used with objects that
// will later be cyclicalJSON.stringif[ied]
// Note that instances of
// String, Number, Boolean, RegExp, Date, and Function
// will pass through.
// This is fine behavior for JSON,
// however it is not a true deepCopy

const RefStore = require('./RefStore');
const shouldPassThrough = require('./shouldPassThrough');

const copy = (origRefStore, replicaRefStore) => value => {
	const refIndex = origRefStore.getRefIndex(value);
	const replication = value instanceof Array ? [] : {};

	if (shouldPassThrough(value)) {
		return value;
	}
	if (refIndex > -1) {
		return replicaRefStore.getRefByIndex(refIndex);
	}

	origRefStore.set(true, value);
	replicaRefStore.set(true, replication);

	return Object.keys(value).reduce((replica, key) => {
		replica[key] = copy(origRefStore, replicaRefStore)(value[key]);

		return replica;
	}, replication);
};

module.exports = function (value) {
	return copy(new RefStore, new RefStore)(value);
};
