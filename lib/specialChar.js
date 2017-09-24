const shouldPassThrough = require('./shouldPassThrough');
const RefStore = require('./RefStore');
const specialChar = '~';

const isSpecialLiteral = value => true &&
	typeof value === 'string' &&
	value.indexOf(specialChar + specialChar) === 0;

const isSpecial = value => true &&
	typeof value === 'string' &&
	value.indexOf(specialChar) === 0 &&
	!isSpecialLiteral(value);


const escape = (value, refStore) => {
	refStore = refStore || new RefStore;

	return (() => { // iife
		// escape the specialChar[s]
		// from the value in place
		if (isSpecial(value)) {
			// append one specialChar to act as an escape
			value = specialChar + value;
		}
		if (
			!shouldPassThrough(value) &&
			!refStore.getRef(value)
		) {
			refStore.set(true, value);

			Object.keys(value).forEach((key) => {
				value[key] = escape(value[key], refStore);
			});
		}

		return value;
	})();
};

module.exports = {
	get: () => specialChar,
	trim: value => value.slice(1),
	escape,
	isSpecial,
	isSpecialLiteral
};
