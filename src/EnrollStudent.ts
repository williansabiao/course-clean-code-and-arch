import ClassRoomRepository from './ClassRoomRepository'
import Enrollment from './Enrollment'
import EnrollmentRepository from './EnrollRepository'
import LevelRepository from './LevelRepository'
import ModuleRepository from './ModuleRepository'
import Invoices from './Invoices'
import Student from './Student/Student'

type studentType = {
  name: string
  cpf: string
  birthDate: string
}

export type enrollmentRequestType = {
  student: studentType
  level: string
  module: string
  class: string
  installments: number
}

export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository
  levelRepository: LevelRepository
  moduleRepository: ModuleRepository
  classRepository: ClassRoomRepository

  constructor(
    levelRepository: LevelRepository,
    moduleRepository: ModuleRepository,
    classRepository: ClassRoomRepository,
    enrollmentRepository: EnrollmentRepository
  ) {
    this.enrollmentRepository = enrollmentRepository
    this.levelRepository = levelRepository
    this.classRepository = classRepository
    this.moduleRepository = moduleRepository
  }

  convertMsToDay(timeInMs: number) {
    return timeInMs / 1000 / 60 / 60 / 24
  }

  execute(enrollmentRequest: enrollmentRequestType): any {
    const student = new Student(
      enrollmentRequest.student.name,
      enrollmentRequest.student.cpf,
      enrollmentRequest.student.birthDate
    )
    const level = this.levelRepository.findByCode(enrollmentRequest.level)
    const module = this.moduleRepository.findByCode(enrollmentRequest.level, enrollmentRequest.module)
    const classRoom = this.classRepository.findByCode(enrollmentRequest.class)

    if (this.classRepository.isClassFinished(classRoom.code)) throw new Error('Class is already finished')
    if (this.classRepository.isClassAlreadyStarted(classRoom.code)) throw new Error('Class is already started')

    if (student.getAge() <= module.minimumAge) throw new Error('Student below minimum age')
    const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(
      enrollmentRequest.level,
      enrollmentRequest.module,
      enrollmentRequest.class
    )
    if (studentsEnrolledInClass.length >= classRoom.capacity) throw new Error('Class is over capacity')

    const existingEnrollment = this.enrollmentRepository.findByCpf(enrollmentRequest.student.cpf)
    if (existingEnrollment) throw new Error('Enrollment with duplicated student is not allowed')

    const sequence = `${this.enrollmentRepository.count() + 1}`.padStart(4, '0')
    const code = `${new Date().getFullYear()}${enrollmentRequest.level}${enrollmentRequest.module}${
      enrollmentRequest.class
    }${sequence}`
    const invoices = new Invoices(module.price, enrollmentRequest.installments)
    const enrollment = new Enrollment(student, level.code, module.code, classRoom.code, code, invoices.generate())
    this.enrollmentRepository.save(enrollment)
    return enrollment
  }
}
