export default class Name {
  value: string
  
  constructor(value: string) {
    const nameRegex = /^([A-Za-z]+ )+([A-Za-z])+$/
    if (!nameRegex.test(value)) throw new Error('Invalid name')
    this.value = value
  }
}