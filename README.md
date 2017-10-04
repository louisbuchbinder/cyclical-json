# Cyclical JSON:

***JSON Sterilization for Cyclical Objects***

JSON stringify will throw an error on cyclical objects. This module will sterilize and revive cyclical objects.

## Files:
``` javascript
main => 'build/cyclical-json.js,'
browser => 'build/cyclical-json.browser.js,'
browser.min => 'build/cyclical-json.browser.min.js'
```

# API:

## cyclicalJSON.stringify

> ***String stringify (value[, replacer[, space]])***

### Parameters

***value:***
 The value to convert to a JSON string.

***replacer | Optional:***
 A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.

***space | Optional:***
 A String or Number object that's used to insert white space into the output JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use as white space; this number is capped at 10 (if it is greater, the value is just 10). Values less than 1 indicate that no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used as white space. If this parameter is not provided (or is null), no white space is used.

***Return value:***
 A JSON string representing the given value.

## cyclicalJSON.parse

> ***Object parse (text[, reviver])***

### Parameters

***text:***
 The string to parse as JSON. See the [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) object for a description of JSON syntax.

***reviver: | Optional:***
 If a function, this prescribes how the value originally produced by parsing is transformed, before being returned.

***Return value:***
 The Object corresponding to the given JSON text.

***Exceptions:***
 Throws a SyntaxError exception if the string to parse is not valid JSON.

# How it Works
***cyclical-json@v2*** implements a legend to minimize recycle time during parsing (as paths are looked-up instead of parsed) and minimize stringify output size (as numerous references to the same object will use the same legend entry)

## Stringify
Values that are equivalent to null, or not `typeof` object, or are an `instanceof` `Date`, `RegExp`, `String`, `Number`, or `Boolean`, or those that include a `toJSON` method are passed through to the standard `JSON.stringify` function and then to the replacer. Other values, namely `instanceof` `Array` and regular JS Objects, will recursively step through the enumerable properties repeating the stringify algorithm for each. With each iteration the value and the absolute path is maintained in a WeakMap. When a redundant value is encountered the absolute path is stored in the legend and the legend index is used instead of the value. Absolute paths are arrays of keys, beginning with the base object, representing the path to the next value. The sterilized output will be a JSON string of an object representing the cyclical legend (legend), the object representing the input (main), and the version of cyclical-json used to produce the output (version). For example:

```javascript
var a = {};

a.a = a;

cyclicalJSON.stringify(a);
// '{"legend":[[]],"main":{"a":"~0"},"version":"cyclical-json@2.0.0"}'

var b = {};
var c = {val: 123};

c.c = c;
b.c = c;

cyclicalJSON.stringify(b);
// '{"legend":[["c"]],"main":{"c":{"val":123,"c":"~0"}},"version":"cyclical-json@2.0.0"}'

var d = [];
var e = {val: true};

e.e = e;
d.push(e);

cyclicalJSON.stringify(d);
// '{"legend":[["0"]],"main":[{"val":true,"e":"~0"}],"version":"cyclical-json@2.0.0"}'
```
To maintain strings with a leading `~`, `cyclicalJSON.stringify` will append a literal `~` to the begining of the string. So, for example:
```javascript
var a = '~';

cyclicalJSON.stringify(a);
// '{"legend":[],"main":"~~","version":"cyclical-json@2.0.0"}'

var b = {a: '~'};

b.b = b;

cyclicalJSON.stringify(b);
// '{"legend":[[]],"main":{"a":"~~","b":"~0"},"version":"cyclical-json@2.0.0"}'
```

## Parse
`JSON.parse` is used under the hood with a recycling algorithm used in a post-processing step. Regular JSON strings can be parsed by `cyclicalJSON.parse`, however caution should be used if the regular JSON string resembles a cyclicalJSON string (is an object with legend, main, and version properties), as cyclicalJSON might interpret this as a cyclicalJSON string instead. The reviver is applied during the `JSON.parse` step with the exception of `special` strings (those representing an object path, ie: `'"~0"'`)and `specialLiteral` strings (those representing a literal string, ie: `'"~~this~is~a~string~"'`). The recycle algorithm then steps through the enumerable properties of the object in search for `special` strings and `specialLiteral` strings. When `special` strings are found the legend is used to look-up the path, which is then used to reference the appropriate location within the root object. When `specialLiteral` strings are encountered they are converted back to their original form and passed through the client reviver function. For example:
```javascript
var a = '{"legend":[[],[0]],"main":[{"val":"~0"},"~~this~is~a~string~","~1"]}'

cyclicalJSON.parse(a);
// [{val: [Circular]}, '~this~is~a~string~', {val: [Circular]}]
```

# JSON MDN Docs

[JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

[JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

[JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
