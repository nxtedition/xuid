const xuid = require('../index')

test('date', () => {
  const time = new Date()
  const a = xuid(time)
  const b = xuid.date(a)
  expect(b).toStrictEqual(time)
  expect(a.length).toStrictEqual(14)
})
