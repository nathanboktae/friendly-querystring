## friendly-querystring

### JSON.stringify <-> JSON.parse your objects in a friendly readable query string format

[![Build Status](https://secure.travis-ci.org/nathanboktae/friendly-querystring.png)](http://travis-ci.org/nathanboktae/friendly-querystring)

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

### Features

- Automatic coercion of core literals (true, false, numbers, empty object, empty array) from their string value
- Arrays
- Empty Arrays and Objects
- Nested Objects, including arrays

### Installation

via bower

```
bower install friendly-querystring
```

or via npm

```
npm install friendly-querystring
```