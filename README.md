## friendly-querystring

### JSON.stringify <-> JSON.parse your objects in a friendly readable query string format

[![Build Status](https://secure.travis-ci.org/nathanboktae/friendly-querystring.png)](http://travis-ci.org/nathanboktae/friendly-querystring)

### Features

- Automatic coercion of core literals (true, false, numbers, empty object, empty array) from their string value
- Arrays
- Empty Arrays and Objects
- Nested Objects, including arrays
- Supports any ES5 environment (Node, browser, PhantomJS, etc) with a UMD wrapper for CommonJS, AMD, and global fallback.

### Example

```javascript
{
  people: [{
    name: { first: 'Bob' },
    age: 34
  }, [null, { hi: undefined }]]
}
```

`stringify`s to and `parse`s back to

```json
"people.0.name.first=Bob&people.0.age=34&people.1.0&people.1.1.hi=undefined"
```

### Limitations

`friendly-querystring` does not aim for compatiblility between query string "standards" (there [are no standards](http://unixpapa.com/js/querystring.html)). This library aims for readability and being able to serialize and deserialize information to the query string, so you can have readable, highly contextual URLs, as you should always, particularly focused on powerful browser clients to keep state in the URL as much as possible to refresh and share links to others to show exactly what they are looking at.

- string values of JavaScript literals `true`, `false`, `undefined`, numbers as strings, `{}`, and `[]` are not supported. (However the first 4 `String()` values are just that).
- `.` in object keys are not supported, as they are used as the path separator. (Configuring the separator is under consideration, send a PR if you're interested in that.)

### Installation

via bower

```
bower install friendly-querystring
```

or via npm

```
npm install friendly-querystring
```