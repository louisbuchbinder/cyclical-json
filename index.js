'use strict';

const shouldPassThrough = require('./lib/shouldPassThrough');
const specialChar = require('./lib/specialChar');
const defaultOptions = require('./lib/defaultOptions');
const deepCopy = require('./lib/deepCopy');
const versionString = require('./lib/versionString');

const decycle = function (base) {
	const legend = [];
	const weakMap = new WeakMap;

	const walk = function (current, path) {
		let modified = current;

		if (!shouldPassThrough(current)) {
			if (weakMap.has(current)) {
				if (weakMap.get(current) instanceof Array) {
					legend.push(weakMap.get(current));
					weakMap.set(current, String(specialChar.get() + (legend.length - 1)));
				}
				modified = weakMap.get(current);
			} else {
				weakMap.set(current, path);
				modified = Object.keys(current).reduce(function (obj, sub) {
					obj[sub] = walk(current[sub], path.concat(sub));

					return obj;
				}, current instanceof Array ? [] : {});
			}
		}

		return modified;
	};

	return {
		legend,
		main: walk(base, [])
	};
};

const recycle = function (master, reviver) {
	let walk = function (current, key, parent) {
		let modified = current;
		let index;

		if (!shouldPassThrough(current)) {
			Object.keys(current).forEach(sub => walk(current[sub], sub, current));
		}
		if (specialChar.isSpecial(current)) {
			modified = master.main;
			index = Number(specialChar.trim(current));
			master.legend[index].forEach(sub => modified = modified[sub]);
		}
		if (specialChar.isSpecialLiteral(current)) {
			modified = reviver(key, specialChar.trim(current), true);
		}
		if (parent) {
			parent[key] = modified;
		}

		return modified;
	};

	if (
		typeof master !== 'object' ||
		master === null ||
		master.main === undefined ||
		master.legend === undefined ||
		!(master.legend instanceof Array) ||
		master.version === undefined ||
		master.version.indexOf('cyclical-json') < 0
	) { // is not a cyclicalJSON string
		return master;
	}

	return walk(master.main);
};

exports.stringify = function (value, replacer, space) {
	const master = decycle(specialChar.escape(deepCopy(value)));
	const legend = JSON.stringify(master.legend);
	const main = JSON.stringify(
		master.main,
		defaultOptions.replacer(replacer),
		space
	);

	return main !== undefined
		? '{' +
			'"legend":' + legend + ',' +
			'"main":' + main + ',' +
			versionString +
		'}'
		: main;
};

exports.parse = function (text, reviver) {
	reviver = defaultOptions.reviver(reviver);

	return recycle(JSON.parse(text, reviver), reviver);
};
