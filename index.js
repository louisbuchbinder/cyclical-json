/* globals window */

(function () {
	var cyclicalJSON = {};
	var versionString = '"version":"cyclical-json@' + '@MODULE_VERSION@' + '"';

	var WeakMap = (function () {
		var WM = function () {
			Object.defineProperties(this, {
				keys: {
					value: []
				},
				values: {
					value: []
				}
			});
		};

		WM.prototype.get = function (key) {
			var index = this.keys.indexOf(key);

			return this.values[index];
		};

		WM.prototype.has = function (key) {
			return this.keys.indexOf(key) >= 0;
		};

		WM.prototype.set = function (key, value) {
			var index = this.keys.indexOf(key);

			if (index >= 0) {
				this.values[index] = value;
			} else {
				this.keys.push(key);
				this.values.push(value);
			}

			return this;
		};

		return WM;
	}());

	var shouldPassThrough = function (value) {
		return typeof value !== 'object' ||
			value === null ||
			typeof value.toJSON === 'function' ||
			value instanceof String ||
			value instanceof Number ||
			value instanceof RegExp ||
			value instanceof Date ||
			value instanceof Boolean;
	};

	var specialChar = '~';

	var isSpecialLiteral = function (value) {
		return typeof value === 'string' &&
			value.indexOf(specialChar + specialChar) === 0;
	};

	var isSpecial = function (value) {
		return typeof value === 'string' &&
			value.indexOf(specialChar) === 0 &&
			!isSpecialLiteral(value);
	};

	var escapeSpecialChar = function (value, weakMap) {
		weakMap = weakMap || new WeakMap;

		return (function () { // iife
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

				Object.keys(value).forEach(function (key) {
					value[key] = escapeSpecialChar(value[key], weakMap);
				});
			}

			return value;
		}());
	};

	var trimSpecialChar = function (value) {
		return value.slice(1);
	};

	var generateReplacer = function (replacer) {
			if (typeof replacer !== 'function') {
				return replacer;
			}

			return function (key, value) {
				if (isSpecialLiteral(value)) {
					return escapeSpecialChar(replacer(key, trimSpecialChar(value)));
				}

				return isSpecial(value)
					? value : replacer(key, value);
			};
		};

	var generateReviver = function (reviver) {
		return function (key, value, isRecycle) {
			if (
				!isRecycle && (
					isSpecial(value) ||
					isSpecialLiteral(value)
				)
			) {
				return value;
			}
			if (typeof reviver === 'function') {
				return reviver(key, value);
			}
			return value;
		};
	};

	var deepCopy = (function () {
		var copy = function (weakMap) {
			return function (value) {
				var replication = value instanceof Array ? [] : {};

				if (shouldPassThrough(value)) {
					return value;
				}
				if (weakMap.has(value)) {
					return weakMap.get(value);
				}

				weakMap.set(value, replication);

				return Object.keys(value).reduce(function (replica, key) {
					replica[key] = copy(weakMap)(value[key]);

					return replica;
				}, replication);
			};
		};

		return function (value) {
			return copy(new WeakMap)(value);
		};
	}());

	var decycle = function (base) {
		var legend = [];
		var weakMap = new WeakMap;

		var walk = function (current, path) {
			var modified = current;

			if (!shouldPassThrough(current)) {
				if (weakMap.has(current)) {
					if (weakMap.get(current) instanceof Array) {
						legend.push(weakMap.get(current));
						weakMap.set(current, String(specialChar + (legend.length - 1)));
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
			legend: legend,
			main: walk(base, [])
		};
	};

	var recycle = function (master, reviver) {
		var walk = function (current, key, parent) {
			var modified = current;
			var index;

			if (!shouldPassThrough(current)) {
				Object.keys(current).forEach(function (sub) {
					return walk(current[sub], sub, current);
				});
			}
			if (isSpecial(current)) {
				modified = master.main;
				index = Number(trimSpecialChar(current));
				master.legend[index].forEach(function (sub) {
					return modified = modified[sub];
				});
			}
			if (isSpecialLiteral(current)) {
				modified = reviver(key, trimSpecialChar(current), true);
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

	cyclicalJSON.stringify = function (value, replacer, space) {
		var master = decycle(escapeSpecialChar(deepCopy(value)));
		var legend = JSON.stringify(master.legend);
		var main = JSON.stringify(
			master.main,
			generateReplacer(replacer),
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

	cyclicalJSON.parse = function (text, reviver) {
		reviver = generateReviver(reviver);

		return recycle(JSON.parse(text, reviver), reviver);
	};

	try {
		module.exports = cyclicalJSON;
	} catch (err) {
		window.cyclicalJSON = cyclicalJSON;
	}
}());
