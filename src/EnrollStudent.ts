import Enrollment from './Enrollment'
import EnrollmentRepository from './EnrollmentRepository'
import LevelRepository from './LevelRepository'
import ModuleRepository from './ModuleRepository'
import Invoices from './Invoice'
import Student from './Student/Student'
import ClassroomRepository from './ClassroomRepository'
import Invoice from './Invoice'
export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository
  levelRepository: LevelRepository
  moduleRepository: ModuleRepository
  classroomRepository: ClassroomRepository

  constructor(
    levelRepository: LevelRepository,
    moduleRepository: ModuleRepository,
    classroomRepository: ClassroomRepository,
    enrollmentRepository: EnrollmentRepository
  ) {
    this.enrollmentRepository = enrollmentRepository
    this.levelRepository = levelRepository
    this.classroomRepository = classroomRepository
    this.moduleRepository = moduleRepository
  }

  convertMsToDay(timeInMs: number) {
    return timeInMs / 1000 / 60 / 60 / 24
  }

  execute(enrollmentRequest: any): any {
    const student = new Student(
      enrollmentRequest.student.name,
      enrollmentRequest.student.cpf,
      enrollmentRequest.student.birthDate
    )
    const level = this.levelRepository.findByCode(enrollmentRequest.level)
    const module = this.moduleRepository.findByCode(enrollmentRequest.level, enrollmentRequest.module)
    const classroom = this.classroomRepository.findByCode(enrollmentRequest.class)

    // por enquanto, não vejo ela dentro de uma entidade
    const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(
      enrollmentRequest.level,
      enrollmentRequest.module,
      enrollmentRequest.class
    )
    if (studentsEnrolledInClass.length === classroom.capacity) throw new Error('Class is over capacity')

    // por enquanto, não vejo ela dentro de uma entidade
    const existingEnrollment = this.enrollmentRepository.findByCpf(enrollmentRequest.student.cpf)
    if (existingEnrollment) throw new Error('Enrollment with duplicated student is not allowed')

    const issueDate = new Date()
    const enrollmentSequence = this.enrollmentRepository.count() + 1
    const enrollment = new Enrollment(
      student,
      level,
      module,
      classroom,
      issueDate,
      enrollmentSequence,
      enrollmentRequest.installments
    )
    this.enrollmentRepository.save(enrollment)
    return enrollment
  }
}
