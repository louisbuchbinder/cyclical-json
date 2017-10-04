
// Isomorphic Test File

var assert;
var path;
var cyclicalJSONPath;
var cyclicalJSON;
var chai;

try {
	// running in node
	// require can be used
	path = require('path');
	cyclicalJSONPath = path.join(__dirname, '..', process.env.NODE_ENV === 'integration' ? '' : 'index.js');
	assert = require('assert');
	chai = require('chai');
	cyclicalJSON = require(cyclicalJSONPath);
} catch (err) {
	if (
		!(err instanceof ReferenceError) ||
		err.message.indexOf('require') < 0
	) {
		throw err;
	}
	// expect global cyclicalJSON, chai
	// in browser tests
}

if (!assert || !assert.deepStrictEqual) {
	assert = chai.assert;
}


describe('Cyclical Json Unit Tests', function () {
	describe('cyclicalJSON.stringify Unit Tests', function () {
		describe('baseline non-cyclical tests', function () {
			it('should JSON.stringify strings', function () {
				var value = 'a string';

				assert.strictEqual(
					JSON.parse(JSON.stringify(value)),
					JSON.parse(cyclicalJSON.stringify(value)).main
				);
			});
			it('should JSON.stringify empty strings', function () {
				var value = '';

				assert.strictEqual(
					JSON.parse(JSON.stringify(value)),
					JSON.parse(cyclicalJSON.stringify(value)).main
				);
			});
			it('should JSON.stringify numbers', function () {
				var value = 123;

				assert.strictEqual(
					JSON.parse(JSON.stringify(value)),
					JSON.parse(cyclicalJSON.stringify(value)).main
				);
			});
			it('should JSON.stringify booleans', function () {
				var value = true;

				assert.strictEqual(
					JSON.parse(JSON.stringify(value)),
					JSON.parse(cyclicalJSON.stringify(value)).main
				);
			});
			it('should JSON.stringify null', function () {
				var value = null;

				assert.strictEqual(
					JSON.parse(JSON.stringify(value)),
					JSON.parse(cyclicalJSON.stringify(value)).main
				);
			});
			it('should JSON.stringify objects with a toJSON method', function () {
				var value = { toJSON: function () { return 1; }};

				assert.strictEqual(
					JSON.parse(JSON.stringify(value)),
					JSON.parse(cyclicalJSON.stringify(value)).main
				);
			});
			it('should JSON.stringify undefined', function () {
				var value = undefined;

				assert.strictEqual(JSON.stringify(value), cyclicalJSON.stringify(value));
			});
			it('should JSON.stringify functions', function () {
				var value = function () {};

				assert.strictEqual(JSON.stringify(value), cyclicalJSON.stringify(value));
			});
			it('should JSON.stringify arrays with undefined and function members', function () {
				var value = [1, true, null, undefined, function () {}];

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should JSON.stringify objects with undefined and function values', function () {
				var value = {a: 1, b: true, c: null, d: undefined, e: function () {}};

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should stringify non-cyclical objects', function () {
				var value = {};

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should stringify non-cyclical objects with parameters', function () {
				var value = {
					a: 'a',
					b: 123,
					c: true,
					d: null,
					e: undefined,
					f: { toJSON: function () { return 1; }}
				};

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should stringify non-cyclical arrays', function () {
				var value = [];

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should stringify non-cyclical arrays with parameters', function () {
				var value = [
					'a',
					123,
					true,
					null,
					undefined,
					{ toJSON: function () { return 1; }}
				];

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should stringify non-cyclical objects with empty keys', function () {
				var value = {'': true};

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should stringify non-cyclical objects with special keys', function () {
				var value = {'~': true};

				assert.strictEqual(
					JSON.stringify(value),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
		});
		describe('cyclicalJSON stringify parent object tests', function () {
			var value = JSON.parse(cyclicalJSON.stringify(''));

			it('should have a legend array', function () {
				assert(
					value.legend instanceof Array,
					'Expected the legend to be an array'
				)
			});
			it('should have a main entry', function () {
				assert(
					typeof value.main !== undefined,
					'Expected the main value to exist'
				)
			});
			it('should have a version string', function () {
				assert(typeof value.version === 'string', 'Version should be a string');
				assert(
					value.version.indexOf('cyclical-json') >= 0,
					'Version should contain cyclical-json'
				);
			});
		});
		describe('cyclical object stringify tests', function () {
			it('should stringify a cyclical object', function () {
				var value = {};
				var expected = { value: '~0' };

				value.value = value;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
			it('should stringify a cyclical array', function () {
				var value = [];
				var expected = ['~0'];

				value[0] = value;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
			it('should stringify a nested cyclical object', function () {
				var value = {};
				var obj = {
					value: value
				};
				var expected = {
					obj: {
						value: '~0',
						obj: '~1'
					}
				};

				value.obj = obj;
				obj.obj = obj;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
			it('should stringify a nested cyclical array', function () {
				var value = [];
				var arr = [];
				var expected = [['~0', '~1']];

				value[0] = arr;
				arr[0] = arr;
				arr[1] = value;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
			it('should stringify a loaded cyclical object', function () {
				var value = {
					a: 'a',
					b: 123,
					c: true,
					d: null,
					e: { toJSON: function () { return 1; }},
					f: [
						'a',
						123,
						true,
						null,
						{ toJSON: function () { return 1; }},
						[]
					]
				};
				var arr = value.f[5];
				var expected = {
					a: 'a',
					b: 123,
					c: true,
					d: null,
					e: 1,
					f: [
						'a',
						123,
						true,
						null,
						1,
						[{ arr: '~0' }]
					]
				};

				arr.push({arr: arr});

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
			it('should stringify cyclical objects with multiple references to the same value', function () {
				var value = {a: {}};
				var expected = {a: '~0', b: '~0', c: '~0'};

				value.a = value;
				value.b = value;
				value.c = value;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
			it('should stringify cyclical objects with empty keys', function () {
				var value = {a: {}};
				var expected = {a: {'': '~0'}};

				value.a[''] = value;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
			it('should stringify cyclical objects with special keys', function () {
				var value = {a: {}};
				var expected = {a: {'~': '~0'}};

				value.a['~'] = value;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(value)).main,
					expected
				);
			});
		});
		describe('specialChar stringify tests', function () {
			it('should escape a literal specialChar', function () {
				var value = '~';

				assert.strictEqual(
					'~~',
					JSON.parse(cyclicalJSON.stringify(value)).main
				);
			});
			it('should escape a literal specialChar in an obj', function () {
				var value = { special: '~' };

				assert.strictEqual(
					'{"special":"~~"}',
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
			it('should escape a literal specialChar in an arr', function () {
				var value = ['~'];

				assert.strictEqual(
					'["~~"]',
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value)).main)
				);
			});
		});
		describe('optional param: "replacer" tests', function () {
			var replacerFn = function (key, val) {
				if (typeof val === 'number') {
					return val + 1;
				}
				if (typeof val === 'boolean') {
					return !val;
				}
				if (typeof val === 'string') {
					return val + val;
				}
				if (val instanceof Array) {
					val = val.concat(122);
				}
				return val;
			};

			it('should match the behavior of JSON.stringify', function () {
				var value = {a: 1, b: true, c: 'string', d: null, e: {a: 1, b: true}, f: ['string']};

				assert.strictEqual(
					JSON.stringify(value, replacerFn),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value, replacerFn)).main)
				);
			});
			it('should match the behavior of JSON.stringify', function () {
				var value = [{a: []}];

				assert.strictEqual(
					JSON.stringify(value, replacerFn),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value, replacerFn)).main)
				);
			});
			it('should match the behavior of JSON.stringify', function () {
				var value = 1;

				assert.strictEqual(
					JSON.stringify(value, replacerFn),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value, replacerFn)).main)
				);
			});
			it('should skip the reviver for specical strings', function () {
				var replacer = function (key, value) {
					return typeof value === 'object' ? value : true;
				};
				var val = {a: 1};
				var expected = {a: true, b: '~0'};

				val.b = val;

				assert.deepStrictEqual(
					JSON.parse(cyclicalJSON.stringify(val, replacer)).main,
					expected
				);

			});
			it('should correctly apply the replacer to specialLiteral strings', function () {
				var replacer = function (key, value) {
					return typeof value !== 'string' ? value : value.length;
				};

				var val = ['', 'a', 'bc', '~', '~~', '~100'];

				assert.strictEqual(
					JSON.stringify(val, replacer),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(val, replacer)).main)
				);
			});
			it('should match the behavior of JSON.stringify using replacer arrays', function () {
				var replacerArr = ['a', '1'];
				var value = {a: {a: 123, b: false}, 1: true, c: {a: 1}};

				assert.deepStrictEqual(
					JSON.parse(JSON.stringify(value, replacerArr)),
					// parse and stringify to match order of keys
					JSON.parse(cyclicalJSON.stringify(value, replacerArr)).main
				);
			});
			it('should match the behavior of JSON.stringify using replacer arrays', function () {
				var replacerArr = ['a', '1'];
				var value = true;

				assert.strictEqual(
					JSON.stringify(value, replacerArr),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value, replacerArr)).main)
				);
			});
			it('should match the behavior of JSON.stringify using replacer arrays', function () {
				var replacerArr = ['a', '1'];
				var value = [0, 1, 2];

				assert.strictEqual(
					JSON.stringify(value, replacerArr),
					JSON.stringify(JSON.parse(cyclicalJSON.stringify(value, replacerArr)).main)
				);
			});
		});
		describe('optional param: "space" tests', function () {
			var value = {a: 1, b: true, c: 'string', d: null, e: [1]};

			it('should match the behavior of JSON.stringify', function () {
				var space = '';
				var expected = JSON.stringify(value, null, space);

				assert(
					cyclicalJSON
						.stringify(value, null, space)
						.indexOf(expected) >= 0,
					'Expected the standard JSON string to be included in the cyclicalJSON string'
				);
			});
			it('should match the behavior of JSON.stringify', function () {
				var space = '  ';
				var expected = JSON.stringify(value, null, space);

				assert(
					cyclicalJSON
						.stringify(value, null, space)
						.indexOf(expected) >= 0,
					'Expected the standard JSON string to be included in the cyclicalJSON string'
				);
			});
			it('should match the behavior of JSON.stringify', function () {
				var space = '~~~'; // Not sure why you would do this?
				var expected = JSON.stringify(value, null, space);

				assert(
					cyclicalJSON
						.stringify(value, null, space)
						.indexOf(expected) >= 0,
					'Expected the standard JSON string to be included in the cyclicalJSON string'
				);
			});
			it('should match the behavior of JSON.stringify', function () {
				var space = 'abcdefghijklmnop'; // Not sure why you would do this?
				var expected = JSON.stringify(value, null, space);

				assert(
					cyclicalJSON
						.stringify(value, null, space)
						.indexOf(expected) >= 0,
					'Expected the standard JSON string to be included in the cyclicalJSON string'
				);
			});
			it('should match the behavior of JSON.stringify', function () {
				var space = 4;
				var expected = JSON.stringify(value, null, space);

				assert(
					cyclicalJSON
						.stringify(value, null, space)
						.indexOf(expected) >= 0,
					'Expected the standard JSON string to be included in the cyclicalJSON string'
				);
			});
			it('should match the behavior of JSON.stringify', function () {
				var space = -2;
				var expected = JSON.stringify(value, null, space);

				assert(
					cyclicalJSON
						.stringify(value, null, space)
						.indexOf(expected) >= 0,
					'Expected the standard JSON string to be included in the cyclicalJSON string'
				);
			});
			it('should use the optional space argument with cyclical objects', function () {
				var val = {};
				var space = '  ';
				var expected = JSON.stringify({val: '~0'}, null, space);

				val.val = val;

				assert(
					cyclicalJSON
						.stringify(val, null, space)
						.indexOf(expected) >= 0,
					'Expected the standard JSON string to be included in the cyclicalJSON string'
				);
			});
		});
	});

	describe('cyclicalJSON.parse Unit Tests', function () {
		describe('baseline non-cyclical parse tests', function () {
			it('should parse JSON strings', function () {
				var value = JSON.stringify('a string');

				assert.strictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
			it('should parse JSON numbers', function () {
				var value = JSON.stringify(123);

				assert.strictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
			it('should parse JSON booleans', function () {
				var value = JSON.stringify(false);

				assert.strictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
			it('should parse JSON null', function () {
				var value = JSON.stringify(null);

				assert.strictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
			it('should parse non-cyclical JSON objects', function () {
				var value = JSON.stringify({});

				assert.deepStrictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
			it('should parse non-cyclical JSON objects with parameters', function () {
				var value = JSON.stringify({
					a: 'a',
					b: 123,
					c: true,
					d: null,
					e: undefined,
					f: { toJSON: function () { return 1; }}
				});

				assert.deepStrictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
			it('should parse non-cyclical JSON arrays', function () {
				var value = JSON.stringify([]);

				assert.deepStrictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
			it('should parse non-cyclical JSON arrays with parameters', function () {
				var value = JSON.stringify([
					'a',
					123,
					true,
					null,
					undefined,
					{ toJSON: function () { return 1; }}
				]);

				assert.deepStrictEqual(JSON.parse(value), cyclicalJSON.parse(value));
			});
		});
		describe('cyclical parse unit tests', function () {
			it('should parse a cyclical object', function () {
				var value = {};

				value.value = value;

				assert.deepStrictEqual(
					cyclicalJSON.parse(cyclicalJSON.stringify(value)),
					value
				);
			});
			it('should parse a cyclical array', function () {
				var value = [];

				value[0] = value;

				assert.deepStrictEqual(
					cyclicalJSON.parse(cyclicalJSON.stringify(value)),
					value
				);
			});
			it('should parse a nested cyclical object', function () {
				var value = {};
				var obj = {
					value: value
				};

				value.obj = obj;
				obj.obj = obj;

				assert.deepStrictEqual(
					cyclicalJSON.parse(cyclicalJSON.stringify(value)),
					value
				);
			});
			it('should parse a nested cyclical array', function () {
				var value = [];
				var arr = [];

				value[0] = arr;
				arr[0] = arr;
				arr[1] = value;

				assert.deepStrictEqual(
					cyclicalJSON.parse(cyclicalJSON.stringify(value)),
					value
				);
			});
			it('should stringify a loaded cyclical object', function () {
				var value = {
					a: 'a',
					b: 123,
					c: true,
					d: null,
					f: [
						'a',
						123,
						true,
						null,
						[]
					]
				};
				var arr = value.f[4];

				arr.push({arr: arr});

				assert.deepStrictEqual(
					cyclicalJSON.parse(cyclicalJSON.stringify(value)),
					value
				);
			});
		});
		describe('specialChar parse unit tests', function () {
			it('should parse a literal specialChar', function () {
				var value = '~';

				assert.strictEqual(cyclicalJSON.parse(cyclicalJSON.stringify(value)), value);
			});
			it('should parse a literal specialChar in an obj', function () {
				var value = { special: '~' };

				assert.deepStrictEqual(cyclicalJSON.parse(cyclicalJSON.stringify(value)), value);
			});
			it('should parse a literal specialChar in an arr', function () {
				var value = ['~'];

				assert.deepStrictEqual(cyclicalJSON.parse(cyclicalJSON.stringify(value)), value);
			});
		});
		describe('optional param: "reviver" tests', function () {

			it('should match the JSON.parse reviver behavior', function () {
				var text = '{"a":1,"b":true,"c":"string","d":null,"e":[1]}';
				var reviver = function (key, val) {
					if (typeof val === 'number') {
						return val + 1;
					}
					if (typeof val === 'boolean') {
						return !val;
					}
					if (typeof val === 'string') {
						return val + val;
					}
					return val;
				};

				assert.deepStrictEqual(
					JSON.parse(text, reviver),
					cyclicalJSON.parse(text, reviver)
				);
			});
			it('should use the reviver on cyclical objects', function () {
				var val = { b: false };

				var text = '{"legend":[[]],"main":{"a":"~0","b":true},"version":"cyclical-json@test"}';
				var reviver = function (key, value) {
					if (typeof value === 'boolean') {
						return !value;
					}
					return value;
				};

				val.a = val;
				assert.deepStrictEqual(val, cyclicalJSON.parse(text, reviver));
			});
			it('should only apply the reviver to the unescaped specialLiteral string', function () {
				var val = { b: '~special' };
				var text = '{"legend":[[]],"main":{"a":"~0","b":"~~"},"version":"cyclical-json@test"}';
				var reviver = function (key, value) {
					if (
						typeof value === 'string' &&
						value.indexOf('~') === 0
					) {
						return value + 'special';
					}
					return value;
				};

				val.a = val;

				assert.deepStrictEqual(val, cyclicalJSON.parse(text, reviver));
			});
		});
	});
});
