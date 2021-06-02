import EnrollStudent, { enrollmentRequestType } from './EnrollStudent'

type enrollmentRequestSutType = {
  student: enrollmentRequestType['student']
  clazz?: enrollmentRequestType['class']
  level?: enrollmentRequestType['level']
  module?: enrollmentRequestType['module']
  class?: enrollmentRequestType['class']
}

const makeSut = ({ student, level = 'EM', module = '1', clazz = 'A' }: enrollmentRequestSutType) => ({
  student,
  level,
  module,
  class: clazz,
})

test('should not enroll without valid student name', function () {
  const enrollStudent = new EnrollStudent()
  const enrollmentRequest = makeSut({
    student: {
      name: 'Ana',
      cpf: '',
      birthDate: '2002-03-01',
    },
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid name'))
})

test('should not enroll without valid student cpf', function () {
  const enrollStudent = new EnrollStudent()
  const enrollmentRequest = makeSut({
    student: {
      name: 'Ana Silva',
      cpf: '123.456.789-99',
      birthDate: '2002-03-01',
    },
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid cpf'))
})

test('Should not enroll duplicated student', function () {
  const enrollStudent = new EnrollStudent()
  const enrollmentRequest = makeSut({
    student: {
      name: 'Ana Silva',
      cpf: '832.081.519-34',
      birthDate: '2002-03-01',
    },
  })
  enrollStudent.execute(enrollmentRequest)
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(
    new Error('Enrollment with duplicated student is not allowed')
  )
})

test('Should enroll 2 student and return them', function () {
  const enrollStudent = new EnrollStudent()
  const enrollmentRequest1 = makeSut({
    student: {
      name: 'Ana Silva',
      cpf: '832.081.519-34',
      birthDate: '2002-03-01',
    },
  })
  const enrollmentRequest2 = makeSut({
    student: {
      name: 'Joseph Silva',
      cpf: '537.891.090-02',
      birthDate: '2002-03-01',
    },
  })
  enrollStudent.execute(enrollmentRequest1)
  expect(enrollStudent.execute(enrollmentRequest2)).toHaveLength(2)
})

test('Should generate enrollment code', function () {
  const enrollStudent = new EnrollStudent()
  const enrollmentRequest = makeSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '1',
    class: 'A',
  })
  const enrollmentRequest2 = makeSut({
    student: {
      name: 'Joseph Silva',
      cpf: '537.891.090-02',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '1',
    class: 'A',
  })
  expect(enrollStudent.execute(enrollmentRequest)[0].enrollmentCode).toEqual('2021EM1A0001')
  expect(enrollStudent.execute(enrollmentRequest2)[1].enrollmentCode).toEqual('2021EM1A0002')
})

test('Should not enroll student below minimum age', function () {
  const enrollStudent = new EnrollStudent()
  const enrollmentRequest = makeSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2018-03-12',
    },
    level: 'EM',
    module: '1',
    class: 'A',
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrowError('Student below minimum age')
})

test('Should not enroll student over class capacity', function () {
  const enrollStudent = new EnrollStudent()
  const enrollmentRequest = makeSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '3',
    class: 'A',
  })
  const enrollmentRequest2 = {
    ...enrollmentRequest,
    student: {
      ...enrollmentRequest.student,
      cpf: '462.601.770-38',
    },
  }
  const enrollmentRequest3 = {
    ...enrollmentRequest,
    student: {
      ...enrollmentRequest.student,
      cpf: '742.469.100-74',
    },
  }
  const enrollmentRequest4 = {
    ...enrollmentRequest,
    student: {
      ...enrollmentRequest.student,
      cpf: '146.709.520-64',
    },
  }
  enrollStudent.execute(enrollmentRequest)
  enrollStudent.execute(enrollmentRequest2)
  enrollStudent.execute(enrollmentRequest3)
  expect(() => enrollStudent.execute(enrollmentRequest4)).toThrowError('Class is over capacity')
})
