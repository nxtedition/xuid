const legacy = require('./legacy')

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const MAX_COUNTER = decode('zz') // 3843
const MAX_RANDOM = decode('zzzzz') // 916132831
const MAX_SPIN = 4096 * 4096

let counter = 0
let counterOffset = Math.floor(Math.random() * MAX_COUNTER)
let counterTime = 0
let time

function encode (number) {
  let str = ''
  for (let n = 0; number > 0; ++n) {
    str = ALPHABET[Math.floor(number % ALPHABET.length)] + str
    number = Math.floor(number / ALPHABET.length)
  }
  return str
}

function decode (str) {
  let number = 0
  for (let n = 0; n < str.length; ++n) {
    const i = ALPHABET.indexOf(str[n])
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

  const date = encode(now)
  const count = encode(counter + counterOffset)
  const random = encode(Math.random() * MAX_RANDOM)

  return (
    date.slice(0, 7).padStart(7, '0') +
    count.slice(0, 2).padStart(2, '0') +
    random.slice(0, 5).padStart(5, '0')
  )
}

xuid.create = xuid

xuid.dateValue = function (id) {
  if (!id || typeof id !== 'string') {
    return
  }

  if (id.charAt(0) < 'S') {
    return legacy.date(id)
  }

  const number = decode(id.slice(0, 7))
  if (!number) {
    return
  }

  return number
}

const MIN_TIME = new Date(2015, 1, 1).valueOf()

xuid.date = function (id) {
  const number = xuid.dateValue(id)
	if (!number || !Number.isFinite(number)) {
		return
	}

	if (number > Date.now() + 86400000 || number < MIN_TIME) {
		return
	}

  return new Date(number)
}

xuid.now = null
xuid.ALPHABET = ALPHABET
xuid.MAX_COUNTER = MAX_COUNTER
xuid.MAX_RANDOM = MAX_RANDOM

module.exports = xuid
