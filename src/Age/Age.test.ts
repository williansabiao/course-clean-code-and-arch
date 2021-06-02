import Age from './Age'

describe('Age', () => {
  test('should throws an error if birthday is invalid', function () {
    expect(() => new Age('31-31-2018')).toThrowError('Invalid age')
  })

  test('should return a Date instance when has a valid birthday', function () {
    expect(new Age('05-05-2018').value).toBeGreaterThanOrEqual(3)
  })
})
