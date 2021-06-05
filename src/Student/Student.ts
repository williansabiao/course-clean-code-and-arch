import Name from '../Name/Name'
import Cpf from '../utils/validateCpf/Cpf'

export default class Student {
  name: Name
  cpf: Cpf
  birthDate: Date

  constructor(name: string, cpf: string, birthDate: string) {
    this.name = new Name(name)
    this.cpf = new Cpf(cpf)
    this.birthDate = new Date(birthDate)
  }
  getAge() {
    const birthday = new Date(this.birthDate)
    const ageDiffMs = Date.now() - birthday.getTime()
    const ageDate = new Date(ageDiffMs)

    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }
}
