var assert = require('assert');
var cycle = require('cycle');
var cyclicalJSON = require('cyclical-json');
var circularJSON = require('circular-json');
var standard = require('./standard');
var report = [];


// Make this a fair test
// cycle.js does not sterillize
cycle.stringify = function (val) {
	return JSON.stringify(cycle.decycle(val));
};
//
cycle.parse = function (text) {
	return cycle.retrocycle(JSON.parse(text));
}
//

var time = function (job) {
	var now = Date.now();

	for (var i = 0; i < 1000; i++) {
		job();
	}

	return Date.now() - now;
};

var test = function (input) {
	var data = {
		desc: input.desc,
		circular: {},
		cyclical: {},
		cycle: {}
	};

	var stringify = function (val, engine) {
		var context = this;
		var job = function () {
			context.val = engine.parse(engine.stringify(val));
		};

		context.time = time(job);
	};

	stringify.call(data.circular, input.val, circularJSON);
	stringify.call(data.cyclical, input.val, cyclicalJSON);
	stringify.call(data.cycle, input.val, cycle);

	assert.deepStrictEqual(input.val, data.cyclical.val);
	assert.deepStrictEqual(data.circular.val, data.cyclical.val);
	assert.deepStrictEqual(data.circular.val, data.cycle.val);

	report.push(data);
};


test(standard['0']);
test(standard['1']);
test(standard['2']);
test(standard['3']);
test(standard['4']);
test(standard['5']);

console.log(report);
