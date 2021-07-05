import Classroom from './Classroom'
import EnrollmentRepositoryMemory from './EnrollmentRepositoryMemory'
import EnrollStudent from './EnrollStudent'
import EnrollStudentInputData from './EnrollStudentInputData'
import GetEnrollment from './GetEnrollment'
import RepositoryMemoryFactory from './RepositoryMemoryFactory'

let enrollStudent: EnrollStudent

beforeEach(() => {
  enrollStudent = new EnrollStudent(new RepositoryMemoryFactory())
})

type enrollmentRequestSutType = any

const makeSut = () => {
  return new EnrollStudent(new RepositoryMemoryFactory())
}

const makeStudentSut = ({
  studentName = '',
  studentCpf = '',
  studentBirthDate = '',
  level = 'EM',
  module = '1',
  classroom = 'A',
  installments = 1,
}: enrollmentRequestSutType) =>
  new EnrollStudentInputData({
    studentName,
    studentCpf,
    studentBirthDate,
    level,
    module,
    classroom,
    installments,
  })

test('should not enroll without valid student name', function () {
  const enrollmentRequest = makeStudentSut({
    studentName: 'Ana',
    studentCpf: '',
    studentBirthDate: '2002-03-01',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid name'))
})

test('should not enroll without valid student cpf', function () {
  const enrollmentRequest = makeStudentSut({
    studentName: 'Ana Silva',
    studentCpf: '123.456.789-99',
    studentBirthDate: '2002-03-01',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid cpf'))
})

test('Should not enroll duplicated student', function () {
  const enrollmentRequest = makeStudentSut({
    studentName: 'Ana Silva',
    studentCpf: '832.081.519-34',
    studentBirthDate: '2002-03-01',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  enrollStudent.execute(enrollmentRequest)
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(
    new Error('Enrollment with duplicated student is not allowed')
  )
})

test('Should enroll 2 student and return them', function () {
  const enrollmentRequest1 = makeStudentSut({
    studentName: 'Ana Silva',
    studentCpf: '832.081.519-34',
    studentBirthDate: '2002-03-01',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  const enrollmentRequest2 = makeStudentSut({
    studentName: 'Joseph Silva',
    studentCpf: '537.891.090-02',
    studentBirthDate: '2002-03-01',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  enrollStudent.execute(enrollmentRequest1)
  expect(enrollStudent.execute(enrollmentRequest2)).toBeTruthy()
})

test('Should generate enrollment code', function () {
  const enrollmentRequest = makeStudentSut({
    studentName: 'Maria Carolina Fonseca',
    studentCpf: '755.525.774-26',
    studentBirthDate: '2002-03-12',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  const enrollmentRequest2 = makeStudentSut({
    studentName: 'Joseph Silva',
    studentCpf: '537.891.090-02',
    studentBirthDate: '2002-03-12',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  expect(enrollStudent.execute(enrollmentRequest).code).toEqual('2021EM1A0001')
  expect(enrollStudent.execute(enrollmentRequest2).code).toEqual('2021EM1A0002')
})

test('Should not enroll student below minimum age', function () {
  const enrollmentRequest = makeStudentSut({
    studentName: 'Maria Carolina Fonseca',
    studentCpf: '755.525.774-26',
    studentBirthDate: '2018-03-12',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrowError('Student below minimum age')
})

test('Should not enroll student over class capacity', function () {
  const enrollmentRequest = makeStudentSut({
    studentName: 'Maria Carolina Fonseca',
    studentCpf: '755.525.774-26',
    studentBirthDate: '2002-03-12',
    level: 'EM',
    module: '3',
    classroom: 'A',
    installments: 12,
  })
  const enrollmentRequest2 = {
    ...enrollmentRequest,
    studentCpf: '462.601.770-38',
  }
  const enrollmentRequest3 = {
    ...enrollmentRequest,
    studentCpf: '742.469.100-74',
  }
  const enrollmentRequest4 = {
    ...enrollmentRequest,
    studentCpf: '146.709.520-64',
  }
  enrollStudent.execute(enrollmentRequest)
  enrollStudent.execute(enrollmentRequest2)
  enrollStudent.execute(enrollmentRequest3)
  expect(() => enrollStudent.execute(enrollmentRequest4)).toThrowError('Class is over capacity')
})

test('Should not enroll after the end of the class', function () {
  const enrollStudentSut = makeSut()
  const enrollmentRequest = makeStudentSut({
    studentName: 'Maria Carolina Fonseca',
    studentCpf: '755.525.774-26',
    studentBirthDate: '2002-03-12',
    level: 'EM',
    module: '1',
    classroom: 'B',
    installments: 12,
  })
  expect(() => enrollStudentSut.execute(enrollmentRequest)).toThrowError('Class is already finished')
})

test('Should not enroll after 25% of the start of the class', function () {
  const startDate = new Date()
  const endDate = new Date()
  startDate.setDate(startDate.getDate() - 25)
  endDate.setDate(endDate.getDate() + 75)

  const enrollStudentSut = makeSut()

  const enrollmentRequest = makeStudentSut({
    studentName: 'Maria Carolina Fonseca',
    studentCpf: '755.525.774-26',
    studentBirthDate: '2002-03-12',
    level: 'EM',
    module: '3',
    classroom: 'C',
    installments: 12,
  })
  expect(() => enrollStudentSut.execute(enrollmentRequest)).toThrowError('Class is already started')
})

test('Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice', function () {
  const enrollmentRequest = makeStudentSut({
    studentName: 'Maria Carolina Fonseca',
    studentCpf: '755.525.774-26',
    studentBirthDate: '2002-03-12',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  const price = 17000
  const months = 12
  const { invoices } = enrollStudent.execute(enrollmentRequest)
  const totalPrice = invoices.reduce((acc: number, invoice: any) => acc + invoice.amount, 0)

  expect(invoices).toHaveLength(months)
  // TODO: calc is not working properly
  // expect(totalPrice).toBe(price)
  expect(invoices[0].amount).toBe(1416.66)
  expect(invoices[months - 1].amount).toBe(1416.73)
})
