import ClassRoomRepositoryMemory from './ClassRoomRepositoryMemory'
import EnrollmentRepositoryMemory from './EnrollmentRepositoryMemory'
import EnrollStudent, { enrollmentRequestType } from './EnrollStudent'
import LevelRepositoryMemory from './LevelRepositoryMemory'
import ModuleRepositoryMemory from './ModuleRepositoryMemory'

let enrollStudent: EnrollStudent

beforeEach(() => {
  const enrollmentRepository = new EnrollmentRepositoryMemory()
  const levelRepository = new LevelRepositoryMemory()
  const moduleRepository = new ModuleRepositoryMemory()
  const classRepository = new ClassRoomRepositoryMemory()
  enrollStudent = new EnrollStudent(levelRepository, moduleRepository, classRepository, enrollmentRepository)
})

type enrollmentRequestSutType = {
  student: enrollmentRequestType['student']
  classRoom?: enrollmentRequestType['class']
  level?: enrollmentRequestType['level']
  module?: enrollmentRequestType['module']
  class?: enrollmentRequestType['class']
  installments?: enrollmentRequestType['installments']
}

const makeSut = (classes: any[]) => {
  const enrollmentRepository = new EnrollmentRepositoryMemory()
  const levelRepository = new LevelRepositoryMemory()
  const moduleRepository = new ModuleRepositoryMemory()
  const classRepository = new ClassRoomRepositoryMemory(classes)
  return new EnrollStudent(levelRepository, moduleRepository, classRepository, enrollmentRepository)
}

const makeStudentSut = ({
  student,
  level = 'EM',
  module = '1',
  classRoom: classRoom = 'A',
  installments = 1,
}: enrollmentRequestSutType) => ({
  student,
  level,
  module,
  class: classRoom,
  installments,
})

test('should not enroll without valid student name', function () {
  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Ana',
      cpf: '',
      birthDate: '2002-03-01',
    },
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid name'))
})

test('should not enroll without valid student cpf', function () {
  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Ana Silva',
      cpf: '123.456.789-99',
      birthDate: '2002-03-01',
    },
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid cpf'))
})

test('Should not enroll duplicated student', function () {
  const enrollmentRequest = makeStudentSut({
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
  const enrollmentRequest1 = makeStudentSut({
    student: {
      name: 'Ana Silva',
      cpf: '832.081.519-34',
      birthDate: '2002-03-01',
    },
  })
  const enrollmentRequest2 = makeStudentSut({
    student: {
      name: 'Joseph Silva',
      cpf: '537.891.090-02',
      birthDate: '2002-03-01',
    },
  })
  enrollStudent.execute(enrollmentRequest1)
  expect(enrollStudent.execute(enrollmentRequest2)).toBeTruthy()
})

test('Should generate enrollment code', function () {
  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '1',
    classRoom: 'A',
  })
  const enrollmentRequest2 = makeStudentSut({
    student: {
      name: 'Joseph Silva',
      cpf: '537.891.090-02',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '1',
    classRoom: 'A',
  })
  expect(enrollStudent.execute(enrollmentRequest).code).toEqual('2021EM1A0001')
  expect(enrollStudent.execute(enrollmentRequest2).code).toEqual('2021EM1A0002')
})

test('Should not enroll student below minimum age', function () {
  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2018-03-12',
    },
    level: 'EM',
    module: '1',
    classRoom: 'A',
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrowError('Student below minimum age')
})

test('Should not enroll student over class capacity', function () {
  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '3',
    classRoom: 'A',
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

test('Should not enroll after the end of the class', function () {
  const enrollStudentSut = makeSut([
    {
      level: 'EM',
      module: '3',
      code: 'A',
      capacity: 5,
      start_date: '2020-06-01',
      end_date: '2020-12-15',
    },
  ])
  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '3',
    classRoom: 'A',
  })
  expect(() => enrollStudentSut.execute(enrollmentRequest)).toThrowError('Class is already finished')
})

test('Should not enroll after 25% of the start of the class', function () {
  const start_date = new Date()
  const end_date = new Date()
  start_date.setDate(start_date.getDate() - 25)
  end_date.setDate(end_date.getDate() + 75)

  const enrollStudentSut = makeSut([
    {
      level: 'EM',
      module: '1',
      code: 'C',
      capacity: 5,
      start_date: start_date.toISOString().substring(0, 10),
      end_date: end_date.toISOString().substring(0, 10),
    },
  ])

  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '1',
    classRoom: 'C',
  })
  expect(() => enrollStudentSut.execute(enrollmentRequest)).toThrowError('Class is already started')
})

test('Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice', function () {
  const enrollmentRequest = makeStudentSut({
    student: {
      name: 'Maria Carolina Fonseca',
      cpf: '755.525.774-26',
      birthDate: '2002-03-12',
    },
    level: 'EM',
    module: '1',
    classRoom: 'A',
    installments: 3,
  })
  const price = 17000
  const priceByMonth = parseFloat((price / 3).toFixed(2))
  const priceLastMonth = price - priceByMonth * 2

  expect(enrollStudent.execute(enrollmentRequest).invoices).toMatchObject([
    { value: priceByMonth },
    { value: priceByMonth },
    { value: priceLastMonth },
  ])
})
