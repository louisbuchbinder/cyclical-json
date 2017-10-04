const shouldPassThrough = require('./shouldPassThrough');
const specialChar = '~';

const isSpecialLiteral = value => true &&
	typeof value === 'string' &&
	value.indexOf(specialChar + specialChar) === 0;

const isSpecial = value => true &&
	typeof value === 'string' &&
	value.indexOf(specialChar) === 0 &&
	!isSpecialLiteral(value);


const escape = (value, weakMap) => {
	weakMap = weakMap || new WeakMap;

	return (() => { // iife
		// escape the specialChar[s]
		// from the value in place
		if (isSpecial(value) || isSpecialLiteral(value)) {
			// append one specialChar to act as an escape
			value = specialChar + value;
		}
		if (
			!shouldPassThrough(value) &&
			!weakMap.has(value)
		) {
			weakMap.set(value);

			Object.keys(value).forEach((key) => {
				value[key] = escape(value[key], weakMap);
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
