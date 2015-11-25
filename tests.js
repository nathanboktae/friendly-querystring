var querystring = require('./friendly-querystring'),
    chai = require('chai')

chai.should()

describe('friendly querystring', function() {
  function parsing(str, obj, x) {
    it(`should parse ${str} as ${obj}`, function() {
      Object.keys(x).forEach(k => querystring.parse(k).should.deep.equal(x[k]))
    })
  }
  function stringifying(str, obj, x) {
    it(`should stringify ${obj} to ${str}`, function() {
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
        '%20foo=%2520foo%3Dbar': { ' foo': '%20foo=bar' }
      })

      verify('a single array of string values', 'an object with one array', {
        'foo=bar&foo=baz': { foo: ['bar', 'baz'] },
        'foo=foo&foo=': { foo: ['foo', ''] }
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