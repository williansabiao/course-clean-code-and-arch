import Enrollment from './Enrollment'
import EnrollmentRepository from './EnrollRepository'

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
  enrollments: Enrollment[]

  constructor() {
    this.enrollments = []
  }

  save(enrollment: Enrollment): void {
    this.enrollments.push(enrollment)
  }
  findAllByClass(level: string, module: string, classRoom: string) {
    return this.enrollments.filter(
      (enrollment) => enrollment.level === level && enrollment.module === module && enrollment.classRoom === classRoom
    )
  }
  findByCpf(cpf: string) {
    return this.enrollments.find((enrollment) => enrollment.student.cpf.value === cpf)
  }
  count(): number {
    return this.enrollments.length
  }
}
