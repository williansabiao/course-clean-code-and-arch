import ClassRepository from './ClassRepository'
import Enrollment from './Enrollment'
import EnrollmentRepository from './EnrollRepository'
import LevelRepository from './LevelRepository'
import ModuleRepository from './ModuleRepository'
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
}

export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository
  levelRepository: LevelRepository
  moduleRepository: ModuleRepository
  classRepository: ClassRepository

  constructor(
    levelRepository: LevelRepository,
    moduleRepository: ModuleRepository,
    classRepository: ClassRepository,
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
    const clazz = this.classRepository.findByCode(enrollmentRequest.class)

    if (this.classRepository.isClassFinished(clazz.code)) throw new Error('Class is already finished')
    if (this.classRepository.isClassAlreadyStarted(clazz.code)) throw new Error('Class is already started')

    if (student.getAge() <= module.minimumAge) throw new Error('Student below minimum age')
    const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(
      enrollmentRequest.level,
      enrollmentRequest.module,
      enrollmentRequest.class
    )
    if (studentsEnrolledInClass.length >= clazz.capacity) throw new Error('Class is over capacity')

    const existingEnrollment = this.enrollmentRepository.findByCpf(enrollmentRequest.student.cpf)
    if (existingEnrollment) throw new Error('Enrollment with duplicated student is not allowed')

    const sequence = `${this.enrollmentRepository.count() + 1}`.padStart(4, '0')
    const code = `${new Date().getFullYear()}${enrollmentRequest.level}${enrollmentRequest.module}${
      enrollmentRequest.class
    }${sequence}`
    const enrollment = new Enrollment(student, level.code, module.code, clazz.code, code)
    this.enrollmentRepository.save(enrollment)
    return enrollment
  }
}
