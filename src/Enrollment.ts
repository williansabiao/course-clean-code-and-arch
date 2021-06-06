import Student from './Student/Student'

export default class Enrollment {
  student: Student
  level: string
  module: string
  classRoom: string
  code: string
  invoices: any[]

  constructor(student: Student, level: string, module: string, classRoom: string, code: string, invoices: any[]) {
    this.student = student
    this.level = level
    this.module = module
    this.classRoom = classRoom
    this.code = code
    this.invoices = invoices
  }
}
