var ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~'

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

function date (id) {
  var number = id && decode(id.slice(0, 7))
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

module.exports = {
  date
}
