export default interface ClassRoomRepository {
  findByCode(code: string): any
  isClassFinished(code: string): any
  isClassAlreadyStarted(code: string): any
}
