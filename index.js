'use strict';

const RefStore = require('./lib/RefStore');
const shouldPassThrough = require('./lib/shouldPassThrough');
const specialChar = require('./lib/specialChar');
const defaultOptions = require('./lib/defaultOptions');
const subKey = require('./lib/subKey');
const deepCopy = require('./lib/deepCopy');

const generateReplacer = function (replacer) {
	const refStore = new RefStore;
	let repFn;

	return repFn = function (key, value, isRecursion) {
		const ref = refStore.getRef(value);
		const specialKey = key || specialChar.get();

		if (ref) {
			return ref;
		}

		if (!shouldPassThrough(value)) {
			refStore.set(specialKey, value);

			value = Object.keys(value).reduce((obj, sub) => {
				if (replacer.isWhitelisted(sub, value, isRecursion)) {
					obj[sub] = repFn(subKey.concat(specialKey, sub), value[sub], true);
				}

				return obj;
			}, value instanceof Array ? [] : {});
		}

		return replacer.replace(key, value, isRecursion);
	};
};

const recycle = function (base, reviver) {
	const walk = function (current, key, parent) {
		let modified = current;

		if (!shouldPassThrough(current)) {
			Object.keys(current).forEach(sub => walk(current[sub], sub, current));
		}
		if (specialChar.isSpecial(current)) {
			modified = base;

			subKey.parse(
				specialChar.trim(current)
			).forEach(sub => modified = modified[sub]);
		}
		if (specialChar.isSpecialLiteral(current)) {
			modified = reviver(key, specialChar.trim(current), true);
		}
		if (parent) {
			parent[key] = modified;
		}

		return modified;
	};

	return walk(base);
};

exports.stringify = function (value, replacer, space) {
	return JSON.stringify(
		specialChar.escape(
			typeof value === 'object'
				? deepCopy(value)
				: value
		),
		generateReplacer(defaultOptions.replacer(replacer)),
		defaultOptions.space(space)
	);
};

exports.parse = function (text, reviver) {
	reviver = defaultOptions.reviver(reviver);

	return recycle(JSON.parse(text, reviver), reviver);
};
