import Name from './Name'

describe('validateStudentName', () => {
  test('should return true if validateStudentName receive a valid name', function () {
    expect(() => new Name('Ana Doe')).toBeDefined()
  })
  
  test('should return false if validateStudentName receive a invalid name', function () {
    expect(() => new Name('Ana')).toThrow(new Error('Invalid name'))
  })
})