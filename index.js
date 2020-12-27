var randomBytes = require('randombytes')
var legacy = require('./legacy')

// [x, 1-8: date, 9-13: random]
function xuid (now) {
  var now = now || xuid.now()
  var date = Number(now).toString(36)
  var random = parseInt(randomBytes(6).toString('hex'), 16).toString(36)

  return 'x' + date.slice(0, 8).padStart(8, '0') + random.slice(-5).padStart(5, '0')
}

xuid.create = xuid

xuid.date = function (id) {
  if (!id || typeof id !== 'string') {
    return
  }

  if (id.charAt(0) !== 'x') {
    return legacy.date(id)
  }

  var number = parseInt(id.slice(1, 9), 36)
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
