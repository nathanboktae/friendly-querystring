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

      verify('plus', '%2B', {
        'foo%2Bbar=%2B1%2B&4%2B5=9': {
          'foo+bar': '+1+',
          '4+5': 9
        }
      })

      verify('a single pair of string values', 'an object with one key', {
        'foo=bar': { foo: 'bar' },
        '%20foo=%2520foo%3Dbar': { ' foo': '%20foo=bar' },
      })

      verify('a single array of string values', {
        'foo.0=bar&foo.1=baz': { foo: ['bar', 'baz'] },
        'foo.0=foo&foo.1=': { foo: ['foo', ''] }
      })

      verify('an array of one value', {
        'foo.0=bar': { foo: ['bar'] },
        'foo.0=false': { foo: [false] }
      })

      verify('number coercion', {
        'a=0&b=-1&c=0.7': {
          a: 0,
          b: -1,
          c: 0.7
        },
        'x.0=0&x.1=1&x.2=3&x.3=7': { x: [0, 1, 3, 7] }
      })

      verify('boolean coercion', {
        'a=true&b=false&c=FALSE': {
          a: true,
          b: false,
          c: 'FALSE'
        },
        'x.0=false&x.1=true&x.2=TRUE': { x: [false, true, 'TRUE'] }
      })

      verify('empty string and null', {
        'foo.0=&foo.1': { foo: ['', null] },
        'one=&two&three=': {
          one: '',
          two: null,
          three: ''
        }
      })

      verify('empty object and empty array', {
        'a={}': { a: {} },
        'b=[]': { b: [] }
      })

      verify('multiple pairs', 'an object with multple keys and values', {
        'list.0=a&list.1=b&foo=bar&c': {
          list: ['a', 'b'],
          foo: 'bar',
          c: null
        }
      })

      describe('nested objects', function() {
        verify('simple nested objects', {
          'opts.sort=desc': {
            opts: {
              sort: 'desc'
            }
          },
          'foo.a=hi&foo.b=world&foob=1': {
            foo: {
              a: 'hi',
              b: 'world'
            },
            foob: 1
          }
        })

        verify('arrays of objects', {
          'people.0.name=Bob&people.0.age=34&people.1.name=Jane&people.1.age=25': {
            people: [{
              name: 'Bob',
              age: 34
            }, {
              name: 'Jane',
              age: 25
            }]
          }
        })

        verify('nested arrays', {
          'matrix.0.0=4&matrix.0.1=5&matrix.1.0=2&matrix.1.1=7': {
            matrix: [[4, 5], [2, 7]]
          }
        })

        verify('complex combination of all the other tests', {
          'people.0.name.first=Bob&people.0.age=34&people.1.0&people.1.1.hi&people.1.1.there=': {
            people: [{
              name: { first: 'Bob' },
              age: 34
            }, [null, { hi: null, there: '' }]]
          }
        })
      })

      if (verb === 'parse') {
        it('should remove a leading ? if it exists', function() {
          querystring.parse('?').should.deep.equal({})
          querystring.parse('?%3Dstrawberry=yum').should.deep.equal({ '=strawberry': 'yum' })
        })

        it('should handle when the leading zero is missing from a decimal', function() {
          querystring.parse('?a=.7&b=-.5').should.deep.equal({
            a: 0.7,
            b: -0.5
          })
        })
      }

      if (verb === 'stringify') {
        it('should stringify with only undefineds as an empty array', function() {
          querystring.stringify({ foo: [undefined] }).should.equal('foo=[]')
          querystring.stringify({ foo: [undefined, undefined] }).should.equal('foo=[]')
        })

        it('should not stringify object properties that are undefined', function() {
          querystring.stringify({ foo: undefined, bar: 'baz' }).should.equal('bar=baz')
          querystring.stringify({ foo: { bar: undefined } }).should.equal('foo={}')
          querystring.stringify({ foo: [{ bar: undefined }, { bar: 'baz' }] }).should.equal('foo.0={}&foo.1.bar=baz')
        })
      }
    })
  })
})