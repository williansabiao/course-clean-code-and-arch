export default interface EnrollmentRepository {
  save(enrollment: any): void
  findAllByClass(level: string, module: string, classRoom: string): any
  findByCpf(cpf: string): any
  count(): number
}
