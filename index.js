var randomBytes = require('randombytes')
var legacy = require('./legacy')

var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function encode (number) {
  var str = ''
  for (var n = 0; number > 0; ++n) {
    str = ALPHABET[Math.floor(number % ALPHABET.length)] + str
    number = Math.floor(number / ALPHABET.length)
  }
  return str
}

function decode (str) {
  var number = 0
  for (var n = 0; n < str.length; ++n) {
    var i = ALPHABET.indexOf(str[n])
    if (i === -1) {
      return
    }
    number = i + number * ALPHABET.length
  }
  return number
}

// [x, 1-7: date, 8-13: random]
function xuid (now) {
  var now = now || xuid.now()
  var date = encode(Number(now))
  var random = encode(parseInt(randomBytes(6).toString('hex'), 16))

  return date.slice(0, 7).padStart(7, '0') + random.slice(-7).padStart(7, '0')
}

xuid.create = xuid

xuid.date = function (id) {
  if (!id || typeof id !== 'string') {
    return
  }

  if (id.charAt(0) < 'S') {
    return legacy.date(id)
  }

  var number = decode(id.slice(0, 7))
  if (!number) {
    return
  }

  var date = new Date(number)
  var now = new Date(Date.now() + 86400000)

  if (date > now || date.getFullYear() < 2015) {
    return
  }

  return date
}

xuid.now = () => Date.now()

module.exports = xuid
