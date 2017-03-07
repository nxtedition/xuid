var randomBytes = require('randombytes')

var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ~abcdefghijklmnopqrstuvwxyz_'

module.exports.encode = function (number) {
  var str = ''

  for (var n = 0; number > 0; ++n) {
    str = ALPHABET[number & 0x3F] + str
    number = Math.floor(number / 64)
  }

  return str
}

module.exports.decode = function (str) {
  var number = 0

  for (var n = 0; n < str.length; ++n) {
    number = ALPHABET.indexOf(str[n]) + number * 64
  }

  return number
}

module.exports.xuid = function nuid () {
  var str = module.exports.encode(Date.now()) +
            module.exports.encode(parseInt(randomBytes(6).toString('hex'), 16))

  while (str.length < 14) {
    str = str + '0'
  }

  return str.substr(0, 14)
}

module.exports.date = function (id) {
  return new Date(module.exports.decode(id.slice(0, 7)))
}

module.exports.default = module.exports.xuid
