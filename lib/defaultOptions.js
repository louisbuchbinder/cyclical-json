const specialChar = require('./specialChar');

module.exports = {
	space: space => space || '',
	replacer: replacer => {

		return {
			isWhitelisted: replacer instanceof Array
			? (key, parent, isRecursion) => isRecursion
				? true
				: parent instanceof Array
					? true
					: replacer.some(whiteListed => whiteListed === key)
			: () => true,
			replace: typeof replacer === 'function'
				? (key, value, isRecursion) => isRecursion ? value : replacer(key, value)
				: (key, value) => value
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
