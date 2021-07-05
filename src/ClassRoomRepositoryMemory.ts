import Classroom from './Classroom'
import classroomRepository from './ClassroomRepository'

export default class ClassroomRepositoryMemory implements classroomRepository {
  classes: Classroom[]

  constructor() {
    this.classes = [
      new Classroom({
        level: 'EM',
        module: '3',
        code: 'A',
        capacity: 3,
        startDate: new Date('2021-06-01'),
        endDate: new Date('2021-12-15'),
      }),
      new Classroom({
        level: 'EM',
        module: '1',
        code: 'B',
        capacity: 10,
        startDate: new Date('2021-06-01'),
        endDate: new Date('2021-06-20'),
      }),
      new Classroom({
        level: 'EM',
        module: '3',
        code: 'C',
        capacity: 5,
        startDate: new Date('2021-05-01'),
        endDate: new Date('2021-07-30'),
      }),
    ]
  }

  convertMsToDay(timeInMs: number) {
    return timeInMs / 1000 / 60 / 60 / 24
  }
  isClassFinished(code: string) {
    const classroom = this.findByCode(code)
    const timeNow = new Date().getTime()
    return timeNow > new Date(classroom.endDate).getTime()
  }
  isClassAlreadyStarted(code: string) {
    const classroom = this.findByCode(code)
    const timeNow = new Date().getTime()
    const startDateTime = new Date(classroom.startDate).getTime()
    const endDateTime = new Date(classroom.endDate).getTime()
    const classPeriodInDays = this.convertMsToDay(endDateTime - startDateTime)
    const daysPastStartedClass = this.convertMsToDay(timeNow - startDateTime)
    const percentagePastStartedClass = (daysPastStartedClass * 100) / classPeriodInDays
    const percentageLimitToEnrollStartedClass = 25

    return timeNow > startDateTime && percentagePastStartedClass > percentageLimitToEnrollStartedClass
  }
  findByCode(code: string) {
    const classroom = this.classes.find((classroom) => classroom.code === code)
    if (!classroom) throw new Error('Class not found')
    return classroom
  }
}
