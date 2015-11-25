var querystring = require('./friendly-querystring'),
    chai = require('chai')

chai.should()

describe('friendly querystring', function() {
  function parsing(str, obj, x) {
    var what
    if (arguments.length === 2) {
      x = obj
      what = `handle ${str}`
    } else {
      what = `parse ${str} as ${obj}`
    }
    it(`should ${what}`, function() {
      Object.keys(x).forEach(k => querystring.parse(k).should.deep.equal(x[k]))
    })
  }
  function stringifying(str, obj, x) {
    var what
    if (arguments.length === 2) {
      x = obj
      what = `handle ${str}`
    } else {
      what = `stringify ${obj} to ${str}`
    }
    it(`should ${what}`, function() {
      Object.keys(x).forEach(k => querystring.stringify(x[k]).should.deep.equal(k))
    })
  }

  [true, false].forEach(v => {
    const verify = v ? parsing : stringifying,
          verb = v ? 'parse' : 'stringify'

    describe(verb, function() {
      verify('an empty string', 'an empty object', { '': {} })

      verify('null if there is no ampersand', 'an object with one property', {
        hi: { hi: null },
        'ampersand!%3F': { 'ampersand!?': null }
      })

      verify('a single pair of string values', 'an object with one key', {
        'foo=bar': { foo: 'bar' },
        '%20foo=%2520foo%3Dbar': { ' foo': '%20foo=bar' },
      })

      verify('a single array of string values', {
        'foo=bar&foo=baz': { foo: ['bar', 'baz'] },
        'foo=foo&foo=': { foo: ['foo', ''] }
      })

      verify('number coercion', {
        'a=0&b=-1&c=0.7': {
          a: 0,
          b: -1,
          c: 0.7
        },
        'x=0&x=1&x=3&x=7': { x: [0, 1, 3, 7]}
      })

      verify('boolean coercion', {
        'a=true&b=false&c=FALSE': {
          a: true,
          b: false,
          c: 'FALSE'
        },
        'x=false&x=true&x=TRUE': { x: [false, true, 'TRUE'] }
      })

      verify('empty string and undefined', {
        'foo=&foo=undefined&foo': { foo: ['', undefined, null] },
        'one=&two&three=undefined': {
          one: '',
          two: null,
          three: undefined
        }
      })

      verify('multiple pairs', 'an object with multple keys and values', {
        'list=a&list=b&foo=bar&c': {
          list: ['a', 'b'],
          foo: 'bar',
          c: null
        }
      })

      if (verb === 'parse') {
        it('should remove the leading ?', function() {
          querystring.parse('?').should.deep.equal({})
          querystring.parse('?%3Dstrawberry=yum').should.deep.equal({ '=strawberry': 'yum' })
        })
      }
    })
  })
})