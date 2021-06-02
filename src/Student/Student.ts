import Age from '../Age/Age'
import Name from '../Name/Name'
import Cpf from '../utils/validateCpf/Cpf'

export default class Student {
  name: Name
  cpf: Cpf
  age: Age

  constructor(name: string, cpf: string, birthday: string) {
    this.name = new Name(name)
    this.cpf = new Cpf(cpf)
    this.age = new Age(birthday)
  }
}
