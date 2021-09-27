'use strict'

const cronometro = require('cronometro')
const crypto = require('crypto')
const xuid = require('.')

cronometro(
  {
    'not pooled' () {
      randomBytes(32)
    },
    'pooled' () {
      randomBytesPooled(32)
    },
    xuid () {
      xuid()
    }
  },
  {
    setup: {
      single(cb) {
        randomBytesPooled()
        setTimeout(cb, 2e3)
      }
    },
  }
)

function randomBytes(size) {
  return crypto.randomBytes(size).toString('hex')
}

const randomPoolSize = 8192 * 4
const randomPool = Buffer.alloc(randomPoolSize)
let randomPoolIndex = randomPool.length
let randomPoolInit = false

function randomBytesPooled(size) {
  if (randomPoolSize - randomPoolIndex < size) {
    return crypto.randomBytes(size)
  }

  const ret = randomPool.toString('hex', randomPoolIndex, randomPoolIndex + size)
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
