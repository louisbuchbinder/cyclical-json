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

## JSON MDN Docs

[JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

[JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

[JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
