import college from './data/college'
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
  enrollments: any[]

  constructor() {
    this.enrollments = []
  }

  isStudentDuplicated(newStudent: studentType): boolean {
    return this.enrollments.findIndex(({ student }) => student.cpf.value === newStudent.cpf) > -1
  }

  generateEnrollmentCode(levelCode: string, moduleCode: string, clazz: string) {
    const sequence = `${this.enrollments.length + 1}`.padStart(4, '0')
    return `${new Date().getFullYear()}${levelCode}${moduleCode}${clazz}${sequence}`
  }

  execute(enrollmentRequest: enrollmentRequestType): any[] {
    const student = new Student(
      enrollmentRequest.student.name,
      enrollmentRequest.student.cpf,
      enrollmentRequest.student.birthDate
    )
    const enrollmentModule = college.modules.find(
      (module) => module.level === enrollmentRequest.level && module.code === enrollmentRequest.module
    )
    const enrollmentClass = college.classes.find(
      (clazz) =>
        clazz.level === enrollmentRequest.level &&
        clazz.code === enrollmentRequest.class &&
        clazz.module === enrollmentRequest.module
    )

    if (!enrollmentModule || student.age.value <= enrollmentModule.minimumAge)
      throw new Error('Student below minimum age')
    if (!enrollmentClass || this.enrollments.length >= enrollmentClass.capacity)
      throw new Error('Class is over capacity')
    if (this.isStudentDuplicated(enrollmentRequest.student))
      throw new Error('Enrollment with duplicated student is not allowed')

    const enrollment = {
      student,
      enrollmentCode: this.generateEnrollmentCode(
        enrollmentRequest.level,
        enrollmentRequest.module,
        enrollmentRequest.class
      ),
    }
    this.enrollments.push(enrollment)
    return this.enrollments
  }
}
