'use strict'

try {
  const crypto = require('crypto')

  const randomPoolSize = 8192 * 4
  const randomPool = Buffer.alloc(randomPoolSize)
  let randomPoolIndex = randomPool.length
  let randomPoolInit = false

  function randomBytesPooled(size) {
    if (randomPoolSize - randomPoolIndex < size) {
      return crypto.randomBytes(size)
    }

    const ret = parseInt(randomPool.toString('hex', randomPoolIndex, randomPoolIndex + size), 16)
    randomPoolIndex += size

    if (randomPoolIndex > randomPool / 2 && !randomPoolInit) {
      randomPoolInit = true
      crypto.randomFill(randomPool, 0, randomPoolIndex, (err) => {
        if (err) {
          console.error(err)
        } else {
          randomPoolIndex = 0
        }
        randomPoolInit = false
      })
    }

    return ret
  }

  randomBytesPooled()

  module.exports = randomBytesPooled
} catch {
  const randomBytes = require('randombytes')
  module.exports = function (size) {
    return parseInt(randomBytes(size).toString('hex'), 16)
  }
}
