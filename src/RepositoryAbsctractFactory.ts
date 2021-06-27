import ClassroomRepository from './ClassroomRepository'
import EnrollmentRepository from './EnrollmentRepository'
import LevelRepository from './LevelRepository'
import ModuleRepository from './ModuleRepository'

export default interface RepositoryAbsctractFactory {
  createLevelRespository(): LevelRepository
  createModuleRepository(): ModuleRepository
  createClassroomRepository(classes?: any): ClassroomRepository
  createEnrollmentRepository(): EnrollmentRepository
}
