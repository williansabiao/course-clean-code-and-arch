import EnrollmentRepository from './EnrollmentRepository'
import RepositoryAbsctractFactory from './RepositoryAbsctractFactory'

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository

  constructor(repositoryFactory: RepositoryAbsctractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository()
  }
  execute(code: string): any {
    const enrollment = this.enrollmentRepository.get(code)
    const balance = enrollment?.getInvoiceBalance()
    return {
      code: enrollment?.code.value,
      balance,
    }
  }
}
