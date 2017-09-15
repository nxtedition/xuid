var randomBytes = require('randombytes')

var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~'
var counter = parseInt(randomBytes(2).toString('hex'), 16)
var max = decode('___')
var time = Date.now()

function encode (number) {
  var str = ''

  for (var n = 0; number > 0; ++n) {
    str = ALPHABET[Math.floor(number % ALPHABET.length)] + str
    number = Math.floor(Math.floor(number / ALPHABET.length))
  }

  return str
}

function decode (str) {
  var number = 0

  for (var n = 0; n < str.length; ++n) {
    var i = ALPHABET.indexOf(str[n])
    if (i === -1) {
      return undefined
    }
    number = i + (number * ALPHABET.length)
  }

  return number
}

// [0-6: date, 7-9: counter, 10-13: random]
function xuid () {
  var now = Date.now()
  var date = encode(now).slice(-7)
  var random = ('000' + encode(counter)).slice(-3) +
               encode(parseInt(randomBytes(6).toString('hex'), 16)).slice(-4)

  if (arguments.length > 0) {
    date = encode(arguments[0]).slice(-7)
  }

  if (arguments.length > 1) {
    random = ('0000000' + encode(arguments[1])).slice(-7)
  }

  if (now !== time && counter > max / 2) {
    counter = parseInt(randomBytes(2).toString('hex'), 16)
  } else {
    counter += 1
  }

  time = now

  return date + random
}

xuid.create = xuid
xuid.date = function (id) {
  var number = id && decode(id.slice(0, 7))
  if (!number) {
    return undefined
  }
  var date = new Date(number)
  var now = new Date(Date.now() + 86400000)
  if (date > now || date.getFullYear() < 2015) {
    return undefined
  }
  return date
}

module.exports = xuid
