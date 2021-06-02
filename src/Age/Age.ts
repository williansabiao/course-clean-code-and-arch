export default class Age {
  value: number

  constructor(value: string) {
    if (isNaN(Date.parse(value))) throw new Error('Invalid age')

    const birthday = new Date(value)
    const ageDiffMs = Date.now() - birthday.getTime()
    const ageDate = new Date(ageDiffMs)

    this.value = Math.abs(ageDate.getUTCFullYear() - 1970)
  }
}
