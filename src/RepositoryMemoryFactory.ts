import ClassroomRepositoryMemory from './ClassroomRepositoryMemory'
import EnrollmentRepositoryMemorySingleton from './EnrollmentRepositoryMemorySingleton'
import LevelRepositoryMemory from './LevelRepositoryMemory'
import ModuleRepositoryMemory from './ModuleRepositoryMemory'
import RepositoryAbsctractFactory from './RepositoryAbsctractFactory'

export default class RepositoryMemoryFactory implements RepositoryAbsctractFactory {
  constructor() {
    EnrollmentRepositoryMemorySingleton.destroy()
  }
  createLevelRespository() {
    return new LevelRepositoryMemory()
  }
  createModuleRepository() {
    return new ModuleRepositoryMemory()
  }
  createClassroomRepository() {
    return new ClassroomRepositoryMemory()
  }
  createEnrollmentRepository() {
    return EnrollmentRepositoryMemorySingleton.getInstance()
  }
}
