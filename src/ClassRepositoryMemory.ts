import ClassRepository from './ClassRepository'

export default class ClassRepositoryMemory implements ClassRepository {
  classes: any[]

  constructor(classes?: any[]) {
    this.classes = classes || [
      {
        level: 'EM',
        module: '3',
        code: 'A',
        capacity: 3,
      },
      {
        level: 'EM',
        module: '1',
        code: 'A',
        capacity: 10,
      },
    ]
  }

  convertMsToDay(timeInMs: number) {
    return timeInMs / 1000 / 60 / 60 / 24
  }
  isClassFinished(code: string) {
    const clazz = this.findByCode(code)
    const timeNow = new Date().getTime()
    return timeNow > new Date(clazz.end_date).getTime()
  }
  isClassAlreadyStarted(code: string) {
    const clazz = this.findByCode(code)
    const timeNow = new Date().getTime()
    const startDateTime = new Date(clazz.start_date).getTime()
    const endDateTime = new Date(clazz.end_date).getTime()
    const classPeriodInDays = this.convertMsToDay(endDateTime - startDateTime)
    const daysPastStartedClass = this.convertMsToDay(timeNow - startDateTime)
    const percentagePastStartedClass = (daysPastStartedClass * 100) / classPeriodInDays
    const percentageLimitToEnrollStartedClass = 25

    return timeNow > startDateTime && percentagePastStartedClass > percentageLimitToEnrollStartedClass
  }
  findByCode(code: string) {
    const clazz = this.classes.find((clazz) => clazz.code === code)
    if (!clazz) throw new Error('Class not found')
    return clazz
  }
}
