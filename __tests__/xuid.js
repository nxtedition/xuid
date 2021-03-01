const xuid = require('../index')

test('date', () => {
  const b = xuid.date('NQ_x0M19OYYgDi')
  expect(b).toStrictEqual(new Date('2020-12-27T16:02:42.177Z'))
})

test('date 2', () => {
  const a = new Date()
  const b = xuid.date(xuid())
  expect(a).toStrictEqual(b)
})

test('order in same tick', () => {
  let prev = xuid()
  for (let n = 0; n < 1000; ++n) {
    const next = xuid()
    expect(next > prev ? 1 : 0).toStrictEqual(1)
    prev = next
  }
})
