const specialChar = require('./specialChar');

module.exports = {
	replacer: replacer => {
		if (typeof replacer !== 'function') {
			return replacer;
		}

		return (key, value) => {
			if (specialChar.isSpecialLiteral(value)) {
				return specialChar.escape(replacer(key, specialChar.trim(value)));
			}

			return specialChar.isSpecial(value)
				? value : replacer(key, value);
		};
	},
	reviver: reviver => (key, value, isRecycle) => {
		if (
			!isRecycle && (
				specialChar.isSpecial(value) ||
				specialChar.isSpecialLiteral(value)
			)
		) {
			return value;
		}
		if (typeof reviver === 'function') {
			return reviver(key, value);
		}
		return value;
	}
};
