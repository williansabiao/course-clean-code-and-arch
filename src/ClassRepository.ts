export default interface ClassRepository {
  findByCode(code: string): any
  isClassFinished(code: string): any
  isClassAlreadyStarted(code: string): any
}
