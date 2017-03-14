var randomBytes = require('randombytes')

var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ~abcdefghijklmnopqrstuvwxyz_'
var counter = 0
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
    const i = ALPHABET.indexOf(str[n])
    if (i === -1) {
      return undefined
    }
    number = i + (number * ALPHABET.length)
  }

  return number
}

function pad2 (str) {
  return str.length === 1 ? `0${str}` : str.slice(0, 2)
}

// [0-6: date, 7-8: counter, 9-13: random]
function xuid () {
  const now = Date.now()

  counter = now === time ? counter + 1 : 0
  time = now

  var str = encode(now) +
            pad2(encode(counter)) +
            encode(parseInt(randomBytes(5).toString('hex'), 16))

  while (str.length < 14) {
    str = str + '0'
  }

  return str.substr(0, 14)
}

xuid.create = xuid
xuid.date = function (id) {
  const number = id && id.length === 14 && decode(id.slice(0, 7))
  if (!number) {
    return undefined
  }
  const date = new Date(number)
  if (date.getFullYear() > 2050 || date.getFullYear() < 2000) {
    return undefined
  }
  return date
}

module.exports = xuid
