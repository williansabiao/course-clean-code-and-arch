import Name from './Name/Name'
import Student from './Student/Student'
import Cpf from './utils/validateCpf/Cpf'

type studentType = {
  name: string
  cpf: string
}

type enrollmentRequestType = {
  student: studentType
}

export default class EnrollStudent {
  enrollments: any[]

  constructor() {
    this.enrollments = []
  }
  
  isStudentDuplicated(newStudent: studentType): boolean {
    return this.enrollments.findIndex(({ student }) => student.cpf.value === newStudent.cpf) > -1
  }

  execute(enrollmentRequest: enrollmentRequestType): studentType[] | Error {
    const student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf)
    if (this.isStudentDuplicated(enrollmentRequest.student))
      throw new Error('Enrollment with duplicated student is not allowed')
    
    const enrollment = { student }
    this.enrollments.push(enrollment)
    return this.enrollments;
  }
}