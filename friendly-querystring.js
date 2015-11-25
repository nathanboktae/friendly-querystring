(function(querystring) {
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    module.exports = querystring
  } else if (typeof define === 'function' && define.amd) {
    define(querystring)
  } else {
    window.friendlyQuerystring = querystring
  }
})({
  parse: function(qs) {
    if (qs[0] === '?') {
      qs = qs.substring(1)
    }
    if (qs.length === 0) return {}

    var literals = {
      'true': true,
      'false': false,
      'undefined': undefined,
      '{}': {},
      '[]': []
    }
    function friendly(val) {
      val = decodeURIComponent(val)
      if (val in literals) return literals[val]
      if (val !== '' && !isNaN(Number(val))) return Number(val)
      return val
    }

    return qs.split('&').reduce(function(query, pair) {
      var equalIdx = pair.indexOf('='),
          val = null,
          key

      if (equalIdx >= 0) {
        key = decodeURIComponent(pair.substr(0, equalIdx))
        val = friendly(pair.substr(equalIdx + 1))
      } else {
        key = decodeURIComponent(pair)
      }

      if (!(key in query)) {
        query[key] = val
      } else if (Array.isArray(query[key])) {
        query[key].push(val)
      } else {
        query[key] = [query[key], val]
      }

      return query
    }, {})
  },
  stringify: function(query) {
    function pairUp(key, val) {
      return encodeURIComponent(key) + (val === null ? '' : '=' + encodeURIComponent(val))
    }

    return Object.keys(query).map(function(key) {
      if (Array.isArray(query[key])) {
        return query[key].map(function(val) { return pairUp(key, val) }).join('&')
      } else {
        return pairUp(key, query[key])
      }
    }).join('&')
  }
})
