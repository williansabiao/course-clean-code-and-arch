import Enrollment from './Enrollment'

export default interface EnrollmentRepository {
  save(enrollment: Enrollment): void
  findAllByClass(level: string, module: string, classRoom: string): Enrollment[]
  findByCpf(cpf: string): Enrollment | undefined
  get(code: string): Enrollment | undefined
  count(): number
}
