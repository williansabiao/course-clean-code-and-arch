import Classroom from './Classroom'
import EnrollmentCode from './EnrollmentCode'
import Invoice from './Invoice'
import InvoiceEvent from './InvoiceEvent'
import Level from './Level'
import Module from './Module'
import Student from './Student/Student'

export default class Enrollment {
  student: Student
  level: Level
  module: Module
  classroom: Classroom
  sequence: number
  invoices: Invoice[]
  issueDate: Date
  code: EnrollmentCode
  installments: number

  constructor(
    student: Student,
    level: Level,
    module: Module,
    classroom: Classroom,
    issueDate: Date,
    sequence: number,
    installements: number = 12
  ) {
    if (student.getAge() <= module.minimumAge) throw new Error('Student below minimum age')
    if (classroom.isFinished(issueDate)) throw new Error('Class is already finished')
    if (classroom.getProgress(issueDate) > 25) throw new Error('Class is already started')
    this.student = student
    this.level = level
    this.module = module
    this.classroom = classroom
    this.issueDate = issueDate
    this.sequence = sequence
    this.code = new EnrollmentCode(level.code, module.code, classroom.code, issueDate, sequence)
    this.invoices = []
    this.installments = installements
    this.generateInvoices()
  }
  generateInvoices() {
    let installmentAmount = Math.trunc((this.module.price / this.installments) * 100) / 100
    for (let i = 1; i <= this.installments; i++) {
      this.invoices.push(new Invoice(this.code.value, i, this.issueDate.getFullYear(), installmentAmount))
    }
    const total = this.invoices.reduce((total, invoice) => {
      total += invoice.amount
      return total
    }, 0)
    const rest = Math.trunc((this.module.price - total) * 100) / 100
    this.invoices[this.installments - 1].amount = installmentAmount + rest
  }
  getInvoiceBalance() {
    return this.invoices.reduce((total, invoice) => total + invoice.getBalance(), 0)
  }
  getInvoice(month: number, year: number): Invoice | undefined {
    const invoice = this.invoices.find((invoice) => invoice.month === month && invoice.year === year)
    return invoice
  }
  payInvoice(month: number, year: number, amount: number) {
    const invoice = this.getInvoice(month, year)
    if (!invoice) throw new Error('Invalid invoice')
    invoice.addEvent(new InvoiceEvent('payment', amount))
  }
}
