var randomBytes = require('randombytes')

var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~'

function xuid () {
  var str = ''
  
  var number = Date.now()
  str = ALPHABET[number & 0b00111111] + str
  number = Math.floor(number / ALPHABET.length)
  str = ALPHABET[number & 0b00111111] + str
  number = Math.floor(number / ALPHABET.length)
  str = ALPHABET[number & 0b00111111] + str
  number = number >>> 6
  str = ALPHABET[number & 0b00111111] + str
  number = number >>> 6
  str = ALPHABET[number & 0b00111111] + str
  number = number >>> 6
  str = ALPHABET[number & 0b00111111] + str
  number = number >>> 6
  str = ALPHABET[number & 0b00111111] + str
  
  var bytes = randomBytes(7)
  str += ALPHABET[bytes[0] & 0b00111111]
  str += ALPHABET[bytes[1] & 0b00111111]
  str += ALPHABET[bytes[2] & 0b00111111]
  str += ALPHABET[bytes[3] & 0b00111111]
  str += ALPHABET[bytes[4] & 0b00111111]
  str += ALPHABET[bytes[5] & 0b00111111]
  str += ALPHABET[bytes[6] & 0b00111111]

  return str
}

xuid.create = xuid

xuid.date = function (str) {
  var number = 0
  for (var n = 0; n < 7 && n < str.length; ++n) {
    var i = ALPHABET.indexOf(str[n])
    if (i === -1) {
      return
    }
    number = i + number * ALPHABET.length
  }

  var date = new Date(number)
  var now = new Date(Date.now() + 86400000)
  
  if (date > now || date.getFullYear() < 2015) {
    return
  }
  
  return date
}

module.exports = xuid

console.log(xuid.date(xuid()))