import Name from "../Name/Name";
import Cpf from "../utils/validateCpf/Cpf";

export default class Student {
  name: Name;
  cpf: Cpf;
  
  constructor (name: string, cpf: string) {
    this.name = new Name(name)
    this.cpf = new Cpf(cpf)
  }
}