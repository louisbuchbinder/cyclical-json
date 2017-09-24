var tmp;

exports['0'] = {
	desc: 'An Empty Object',
	val: {}
};

exports['1'] = {
	desc: 'An Empty Array',
	val: []
};

exports['2'] = {
	desc: 'A large flat object',
	val: {
		a: true,
		b: false,
		c: null,
		d: 1E10,
		e: 1234567890,
		f: 'louisbuchbinder/cyclical-json',
		g: 'Louis Buchbinder Bump minor version. Build with node@8.6.0. Add package-lock.json',
		h: 'space | Optional: A String or Number object that\'s used to insert white space into the output JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use as white space; this number is capped at 10 (if it is greater, the value is just 10). Values less than 1 indicate that no space should be used. If this is a String, the string (or the first 10 characters of the string, if it\'s longer than that) is used as white space. If this parameter is not provided (or is null), no white space is used.',
		i: 'replacer | Optional: A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.',
		j: 'cyclical-json@v2 implements a legend to minimize recycle time during parsing (as paths are looked-up instead of parsed) and minimize stringify output size (as numerous references to the same object will use the same legend entry)',
		k: 'Values that are equivalent to null, or not typeof object, or are an instanceof Date, RegExp, String, Number, or Boolean, or those that include a toJSON method are passed through to the standard JSON.stringify function and then to the replacer. Other values, namely instanceof Array and regular JS Objects, will recursively step through the enumerable properties repeating the stringify algorithm for each. With each iteration the value and the absolute path is maintained in a WeakMap. When a redundant value is encountered the absolute path is stored in the legend and the legend index is used instead of the value. Absolute paths are arrays of keys, beginning with the base object, representing the path to the next value. The sterilized output will be a JSON string of an object representing the cyclical legend (legend), the object representing the input (main), and the version of cyclical-json used to produce the output (version).',
		l: 'JSON.parse is used under the hood with a recycling algorithm used in a post-processing step. Regular JSON strings can be parsed by cyclicalJSON.parse, however caution should be used if the regular JSON string resembles a cyclicalJSON string (is an object with legend, main, and version properties), as cyclicalJSON might interpret this as a cyclicalJSON string instead. The reviver is applied during the JSON.parse step with the exception of special strings (those representing an object path, ie: \'"~0"\')and specialLiteral strings (those representing a literal string, ie: \'"~~this~is~a~string~"\'). The recycle algorithm then steps through the enumerable properties of the object in search for special strings and specialLiteral strings. When special strings are found the legend is used to look-up the path, which is then used to reference the appropriate location within the root object. When specialLiteral strings are encountered they are converted back to their original form and passed through the client reviver function.',
		m: '{"name":"cyclical-json","license":"MIT","version":"2.1.2","main":"build/cyclical-json.js","description":"JSON Sterilization for Cyclical Objects","keywords":["JSON","cyclical","circular","reference","recursive","recursion","parse","stringify"],"homepage":"https://github.com/louisbuchbinder/cyclical-json","bugs":{"url":"https://github.com/louisbuchbinder/cyclical-json/issues"},"author":"Louis Buchbinder","contributors":[],"files":["README.md","LICENSE","package.json","build"],"repository":{"type":"git","url":"https://github.com/louisbuchbinder/cyclical-json.git"},"engines":{"node":">=0.10"},"dependencies":{},"devDependencies":{"chai":"^4.1.2","eslint":"^4.7.2","eslint-config-flickr":"^1.3.1","jenkins-mocha":"^5.0.0","uglify-js":"^3.1.3"},"scripts":{"build":"bash script/build.sh","lint":"eslint --cache .","test":"jenkins-mocha test --recursive","test-integration":"export NODE_ENV=\'integration\' && mocha test --recursive","test-integration-min":"export NODE_ENV=\'integration-min\' && mocha test --recursive","test-browser":"open test/index.browser.test.html","test-browser-min":"open test/index.browser.min.test.html","view-coverage":"open artifacts/coverage/lcov-report/index.html"}}',
		n: 'Louis Buchbinder default to module.exports',
		o: 'rm -rf node_modules',
		p: 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
		q: 'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.',
		r: 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
		s: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.',
		t: 'https://www.flickr.com/explore',
		u: 'MjAzMDhmZWQ1YTNjOTNlMjgwZWZlNTY1YzEwMjRkYjI4ZTI2MmVlMTdiMzg3OGFkZTZiNjdhNzBlNmFhYTE3NAo=',
		v: '3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706',
		w: '... then the chicken then the egg then the chicken then the egg then the chicken then the egg then the chicken then the egg ...',
		x: 'alalalalallalalalalalalalallalalalalalalalalalalalalalalalalallalalalalala',
		y: 'JavaScript, often abbreviated as JS, is a high-level, dynamic, weakly typed, object-based, multi-paradigm, and interpreted programming language. (https://en.wikipedia.org/wiki/JavaScript)',
		z: 'THIS IS THE END'
	}
};

tmp = (function () {
	var arr = [];

	for (var i = 0; i < 10; i++) {
		arr.push(Object.create(exports['2'].val));
	}

	return arr;
})();

exports['3'] = {
	desc: 'A large array of unique objects',
	val: tmp
};

tmp = (function () {
	var arr = [];

	for (var i = 0; i < 1000; i++) {
		arr.push(exports['2'].val);
	}

	return arr;
})();

exports['3'] = {
	desc: 'A large array of identical objects',
	val: tmp
};

tmp = (function () {
	var obj = {};

	obj.obj = obj;

	return obj;
})();

exports['4'] = {
	desc: 'A simple cyclical object',
	val: tmp
};

tmp = (function () {
	var arr = [];

	arr.push([], arr),
	arr[0].push([], arr[0]);
	arr[0][0].push([], arr[0][0]);
	arr[0][0][0].push([], arr[0][0][0]);
	arr[0][0][0][0].push([], arr[0][0][0][0]);
	arr[0][0][0][0][0].push([], arr[0][0][0][0][0]);
	arr[0][0][0][0][0][0].push([], arr[0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0][0][0][0][0][0][0]);
	arr[0][0][0][0][0][0][0][0][0][0][0][0][0][0].push([], arr[0][0][0][0][0][0][0][0][0][0][0][0][0][0]);

	return arr;
})();

exports['4'] = {
	desc: 'A deeply nested cyclical array',
	val: tmp
};


tmp = {};
tmp.a = {};
tmp.a.a = {};
tmp.a.b = {};
tmp.a.c = {};
tmp.a.d = {};
tmp.a.e = {};
tmp.b = {};
tmp.b.a = {};
tmp.b.b = {};
tmp.b.c = {};
tmp.b.d = {};
tmp.b.e = {};
tmp.b.f = {};
tmp.b.g = {};
tmp.c = {};
tmp.c.a = {};
tmp.c.b = {};
tmp.c.c = {};
tmp.c.d = {};
tmp.c.e = {};
tmp.c.f = {};
tmp.c.g = {};
tmp.d = {};
tmp.e = {};
tmp.f = {};
tmp.g = {};
tmp.h = {};
tmp.i = {};
tmp.a.c.c = tmp.c.c;
tmp.b.c.c = tmp.c.c;
tmp.a.b.c = tmp.c.c;
tmp.a.a.c = tmp.c.c;
tmp.a.b.b = tmp.b.b;
tmp.c.b.b = tmp.b.b;
tmp.a.b.b = tmp.b.b;


exports['5'] = {
	desc: 'A deeply nested cyclical obj',
	val: tmp
};

