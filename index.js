var getRandom = require('./random')
var legacy = require('./legacy')

var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
var MAX_COUNTER = decode('zz') // 3843
var MAX_RANDOM = decode('zzzzz') // 916132831
var MAX_SPIN = 4096 * 4096

var counter = 0
var counterOffset = Math.floor(Math.random() * MAX_COUNTER)
var counterTime = 0
var time

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

// [1-7: date, 8-9: counter, 10-14: random]
function xuid (now) {
  if (!now) {
    now = xuid.now ? xuid.now() : Date.now()

    if (counterTime !== now) {
      counter = 0
      counterTime = now
    }

    if (counter >= MAX_COUNTER) {
      for (var n = 0; time && now <= time; ++n) {
        if (n > MAX_SPIN) {
          throw new Error('bad xuid.now()')
        }
        now = xuid.now ? xuid.now() : Date.now()
      }
      counter = 0
      counterTime = now
    } else {
      counter += 1
    }

    time = now
  } else {
    if (counter >= MAX_COUNTER) {
      counter = 0
    } else {
      counter += 1
    }
  }

  var date = encode(now)
  var count = encode(counter + counterOffset)
  var random = encode(getRandom(6))

  return (
    date.slice(0, 7).padStart(7, '0') +
    count.slice(0, 2).padStart(2, '0') +
    random.slice(0, 5).padStart(5, '0')
  )
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

xuid.now = null
xuid.ALPHABET = ALPHABET
xuid.MAX_COUNTER = MAX_COUNTER
xuid.MAX_RANDOM = MAX_RANDOM

module.exports = xuid
