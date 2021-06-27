import ClassroomRepositoryMemory from './ClassroomRepositoryMemory'
import EnrollmentRepositoryMemory from './EnrollmentRepositoryMemory'
import LevelRepositoryMemory from './LevelRepositoryMemory'
import ModuleRepositoryMemory from './ModuleRepositoryMemory'
import RepositoryAbsctractFactory from './RepositoryAbsctractFactory'

export default class RepositoryMemoryFactory implements RepositoryAbsctractFactory {
  createLevelRespository() {
    return new LevelRepositoryMemory()
  }
  createModuleRepository() {
    return new ModuleRepositoryMemory()
  }
  createClassroomRepository(classes?: any) {
    return new ClassroomRepositoryMemory(classes)
  }
  createEnrollmentRepository() {
    return new EnrollmentRepositoryMemory()
  }
}
