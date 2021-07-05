import EnrollmentRepository from './EnrollmentRepository'
import RepositoryAbsctractFactory from './RepositoryAbsctractFactory'

export default class PayInvoice {
  enrollmentRepository: EnrollmentRepository

  constructor(repositoryFactory: RepositoryAbsctractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository()
  }
  execute(code: string, month: number, year: number, amount: number): any {
    const enrollment = this.enrollmentRepository.get(code)
    if (!enrollment) throw new Error('Enrollment not found')
    enrollment.payInvoice(month, year, amount)
  }
}
