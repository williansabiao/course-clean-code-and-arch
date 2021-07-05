import Enrollment from './Enrollment'
import EnrollmentRepository from './EnrollmentRepository'

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
  enrollments: Enrollment[]

  constructor() {
    this.enrollments = []
  }

  save(enrollment: Enrollment): void {
    this.enrollments.push(enrollment)
  }
  findAllByClass(level: string, module: string, classoom: string) {
    return this.enrollments.filter(
      (enrollment) =>
        enrollment.level.code === level && enrollment.module.code === module && enrollment.classroom.code === classoom
    )
  }
  findByCpf(cpf: string) {
    return this.enrollments.find((enrollment) => enrollment.student.cpf.value === cpf)
  }
  get(code: string) {
    return this.enrollments.find((enrollment) => enrollment.code.value === code)
  }
  count(): number {
    return this.enrollments.length
  }
}
