import EnrollStudent from './EnrollStudent'
import EnrollStudentInputData from './EnrollStudentInputData'
import GetEnrollment from './GetEnrollment'
import RepositoryMemoryFactory from './RepositoryMemoryFactory'

let enrollStudent: EnrollStudent
let getEnrollment: GetEnrollment

beforeEach(() => {
  const repositoryMemoryFactory = new RepositoryMemoryFactory()
  enrollStudent = new EnrollStudent(repositoryMemoryFactory)
  getEnrollment = new GetEnrollment(repositoryMemoryFactory)
})

test.only('Should get enrollment by code with invoice balance', function () {
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

  const getEnrollmentOutputData = getEnrollment.execute(expectedCode)
  expect(getEnrollmentOutputData.code).toBe(expectedCode)
  expect(getEnrollmentOutputData.balance).toBe(16999.99)
})
