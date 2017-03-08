var randomBytes = require('randombytes')

var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ~abcdefghijklmnopqrstuvwxyz_'

function encode (number) {
  var str = ''

  for (var n = 0; number > 0; ++n) {
    str = ALPHABET[number & 0x3F] + str
    number = Math.floor(number / 64)
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
    number = i + (number * 64)
  }

  return number
}

function xuid () {
  var str = encode(Date.now()) +
            encode(parseInt(randomBytes(6).toString('hex'), 16))

  while (str.length < 14) {
    str = str + '0'
  }

  return str.substr(0, 14)
}

xuid.create = xuid
xuid.date = function (id) {
  const number = id && id.length === 14 && decode(id.slice(0, 7))
  return number ? new Date(number) : undefined
}

module.exports = xuid
