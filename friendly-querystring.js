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

      var paths = key.split('.'), iterObj = query
      for (var i = 0; i < paths.length - 1; i++) {
        if (iterObj[paths[i]] == null) {
          iterObj[paths[i]] = isNaN(Number(paths[i + 1])) ? {} : []
        }
        iterObj = iterObj[paths[i]]
      }

      var k = paths[paths.length - 1]
      if (!(k in iterObj)) {
        iterObj[k] = val
      } else if (Array.isArray(iterObj[k])) {
        iterObj[k].push(val)
      } else {
        iterObj[k] = [iterObj[k], val]
      }

      return query
    }, {})
  },
  stringify: function(origObj) {
    function pairUp(key, val) {
      return encodeURIComponent(key) + (val === null ? '' : '=' + encodeURIComponent(val))
    }

    function recurseKeys(key, val) {
      if (Array.isArray(val)) {
        return val.length ?
          val.map(function(v, i) { return recurseKeys(key + '.' + i, v) }).join('&') :
          encodeURIComponent(key) + '=[]'
      } else if (val && typeof val === 'object') {
        return Object.keys(val).length ?
          recurse(val, key + '.') :
          encodeURIComponent(key) + '={}'
      } else {
        return pairUp(key, val)
      }
    }

    function recurse(obj, prefix) {
      return Object.keys(obj).map(function(key) {
        return recurseKeys(prefix + key, obj[key])
      }).join('&')
    }

    return recurse(origObj, '')
  }
})
