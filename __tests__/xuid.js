const xuid = require('../index')

test('legacy', () => {
  const time = new Date()
  const a = xuid(time)
  const b = xuid.date(a)
  expect(b).toStrictEqual(time)
  expect(a.length).toStrictEqual(14)
})

test('date', () => {
  const b = xuid.date('NQ_x0M19OYYgDi')
  expect(b).toStrictEqual(new Date('2020-12-27T16:02:42.177Z'))
})
