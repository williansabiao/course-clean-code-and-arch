import Enrollment from './Enrollment'
import EnrollmentRepository from './EnrollmentRepository'
import LevelRepository from './LevelRepository'
import ModuleRepository from './ModuleRepository'
import Student from './Student/Student'
import ClassroomRepository from './ClassroomRepository'
import RepositoryAbstractFactory from './RepositoryAbsctractFactory'
import EnrollStudentInputData from './EnrollStudentInputData'
import EnrollStudentOutputData from './EnrollStudentOutputData'
export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository
  levelRepository: LevelRepository
  moduleRepository: ModuleRepository
  classroomRepository: ClassroomRepository

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository()
    this.levelRepository = repositoryFactory.createLevelRespository()
    this.classroomRepository = repositoryFactory.createClassroomRepository()
    this.moduleRepository = repositoryFactory.createModuleRepository()
  }

  convertMsToDay(timeInMs: number) {
    return timeInMs / 1000 / 60 / 60 / 24
  }

  execute(enrollmentStudentInputData: EnrollStudentInputData): EnrollStudentOutputData {
    const student = new Student(
      enrollmentStudentInputData.studentName,
      enrollmentStudentInputData.studentCpf,
      enrollmentStudentInputData.studentBirthDate
    )
    const level = this.levelRepository.findByCode(enrollmentStudentInputData.level)
    const module = this.moduleRepository.findByCode(enrollmentStudentInputData.level, enrollmentStudentInputData.module)
    const classroom = this.classroomRepository.findByCode(enrollmentStudentInputData.classroom)

    // por enquanto, não vejo ela dentro de uma entidade
    const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(
      enrollmentStudentInputData.level,
      enrollmentStudentInputData.module,
      enrollmentStudentInputData.classroom
    )
    if (studentsEnrolledInClass.length === classroom.capacity) throw new Error('Class is over capacity')

    // por enquanto, não vejo ela dentro de uma entidade
    const existingEnrollment = this.enrollmentRepository.findByCpf(enrollmentStudentInputData.studentCpf)
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
      enrollmentStudentInputData.installments
    )
    this.enrollmentRepository.save(enrollment)
    const enrollStudentOutputData = new EnrollStudentOutputData({
      code: enrollment.code.value,
      // invoices: enrollment.invoices,
    })
    for (const invoice of enrollment.invoices) {
      enrollStudentOutputData.invoices.push(invoice.clone())
    }
    return enrollStudentOutputData
  }
}
