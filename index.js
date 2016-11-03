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

module.exports.default = function nuid () {
  var str = encode(Date.now()) +
            encode(parseInt(randomBytes(6).toString('hex'), 16))

  while (str.length < 14) {
    str = str + '0'
  }

  return str.substr(0, 14)
}
