package services

import models.{ErrorMessage, Instance}
import play.api.Logger
import javax.inject.Inject
import scala.collection.mutable.ListBuffer

class DatabaseManagerService @Inject()(pgClusterService: PgClusterService, roleService: RoleService, instanceService: InstanceService) {

  val logger: Logger = Logger(this.getClass)

  def deleteDatabase(instanceId: Long, userId: Long): Either[List[ErrorMessage], Int] = {
    instanceService.getInstance(instanceId, userId) match {
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL =>
        deletePostgresDatabase(instanceId, userId, instance.name)
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
        deleteMongoDBDatabase(instanceId, userId)
      case Left(value) => Left(List(value))
    }
  }


  def deletePostgresDatabase(instanceId: Long, userId: Long, databaseName: String): Either[List[ErrorMessage], Int] = {
    val errors = ListBuffer[ErrorMessage]()
    // Delete roles

    roleService.deleteDatabaseRoles(instanceId) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }
    // Delete instance
    instanceService.deleteInstance(instanceId, userId) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }
    // Delete postgres database
    pgClusterService.deleteDatabase(databaseName) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    errors match {
      case ListBuffer() => Right(1)
      case _ => Left(errors.toList)
    }
  }

  def deleteMongoDBDatabase(instanceId: Long, userId: Long): Either[List[ErrorMessage], Int] = {
    val errors = ListBuffer[ErrorMessage]()
    // Delete instance
    instanceService.deleteInstance(instanceId, userId) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }
    errors match {
      case ListBuffer() => Right(1)
      case _ => Left(errors.toList)
    }
  }

}
