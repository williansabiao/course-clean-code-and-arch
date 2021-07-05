import EnrollStudent from './EnrollStudent'
import EnrollStudentInputData from './EnrollStudentInputData'
import GetEnrollment from './GetEnrollment'
import PayInvoice from './PayInvoice'
import RepositoryMemoryFactory from './RepositoryMemoryFactory'

let enrollStudent: EnrollStudent
let getEnrollment: GetEnrollment
let payInvoice: PayInvoice

beforeEach(() => {
  const repositoryMemoryFactory = new RepositoryMemoryFactory()
  enrollStudent = new EnrollStudent(repositoryMemoryFactory)
  getEnrollment = new GetEnrollment(repositoryMemoryFactory)
  payInvoice = new PayInvoice(repositoryMemoryFactory)
})

test('Should pay enrollment invoice', function () {
  const enrollmentRequest = new EnrollStudentInputData({
    studentName: 'Maria Carolina Fonseca',
    studentCpf: '755.525.774-26',
    studentBirthDate: '2002-03-12',
    level: 'EM',
    module: '1',
    classroom: 'A',
    installments: 12,
  })
  enrollStudent.execute(enrollmentRequest)
  const expectedCode = '2021EM1A0001'

  payInvoice.execute(expectedCode, 1, 2021, 1416.66)

  const getEnrollmentOutputData = getEnrollment.execute(expectedCode)
  expect(getEnrollmentOutputData.code).toBe(expectedCode)
  expect(getEnrollmentOutputData.balance).toBe(15583.33)
})
