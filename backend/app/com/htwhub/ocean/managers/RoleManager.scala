package com.htwhub.ocean.managers

import com.htwhub.ocean.engines.MongoDBEngine
import com.htwhub.ocean.engines.PostgreSQLEngine
import com.htwhub.ocean.managers.exceptions.ManagerException
import com.htwhub.ocean.managers.DatabaseManager.Exceptions
import com.htwhub.ocean.models.Instance
import com.htwhub.ocean.models.Instance.MongoDBSQLEngineType
import com.htwhub.ocean.models.Instance.PostgreSQLEngineType
import com.htwhub.ocean.models.InstanceId
import com.htwhub.ocean.models.Role
import com.htwhub.ocean.models.RoleId
import com.htwhub.ocean.models.User
import com.htwhub.ocean.serializers.CreateRoleFormData
import com.htwhub.ocean.service.exceptions.ServiceException
import com.htwhub.ocean.service.InstanceService
import com.htwhub.ocean.service.RoleService
import java.security.SecureRandom
import javax.inject.Inject
import play.api.Configuration
import play.api.Logger
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class RoleManager @Inject() (
  configuration: Configuration,
  instanceService: InstanceService,
  roleService: RoleService,
  postgreSQLEngine: PostgreSQLEngine,
  mongoDBEngine: MongoDBEngine
)(implicit
  ec: ExecutionContext
) {

  val logger: Logger = Logger(this.getClass)

  val LDAP_GROUP_NAME: String = configuration.get[String]("ldap_role")
  val GENERIC_GROUP_NAME: String = configuration.get[String]("generic_role")

  def getRolesByInstanceId(instanceId: InstanceId, user: User): Future[Seq[Role]] =
    roleService
      .getRolesByInstanceId(instanceId, user.id)
      .recoverWith { case e: ServiceException => serviceErrorMapper(e) }

  def addRole(createRoleFormData: CreateRoleFormData, user: User): Future[Role] = {
    val rolePassword = generateRolePassword()
    val localRole = Role(RoleId(0), createRoleFormData.instanceId, createRoleFormData.roleName, rolePassword)
    for {
      instance <- instanceService
        .getUserInstanceById(createRoleFormData.instanceId, user.id)
        .recoverWith { case e: ServiceException => serviceErrorMapper(e) }
      role <- roleService
        .addRole(localRole, user.id)
        .recoverWith { case e: ServiceException => serviceErrorMapper(e) }
      job2 <- addRoleForPostgreSQL(role, instance) if instance.engine == Instance.PostgreSQLEngineType
      job3 <- addRoleForMongoDB(role, instance) if instance.engine == Instance.MongoDBSQLEngineType
    } yield role
  }

  def addRoleForPostgreSQL(role: Role, instance: Instance): Future[List[Int]] =
    for {
      job1 <- postgreSQLEngine
        .createRoleInGroupWithPassword(role.name, GENERIC_GROUP_NAME, role.password)
        .recoverWith { t: Throwable => internalError(t.getMessage) }
      job2 <- postgreSQLEngine
        .grantDatabaseAccess(instance.name, role.name)
        .recoverWith { t: Throwable => internalError(t.getMessage) }
    } yield job1.toList ++ job2.toList

  def addRoleForMongoDB(role: Role, instance: Instance): Future[Any] =
    for {
      job1 <- mongoDBEngine
        .createUser(instance.name, role.name, role.password)
        .recoverWith { t: Throwable => internalError(t.getMessage) }
    } yield job1

  def deleteRoleById(roleId: RoleId, user: User): Future[List[Int]] =
    for {
      role <- roleService
        .getRoleByById(roleId, user.id)
        .recoverWith { case e: ServiceException => serviceErrorMapper(e) }
      instance <- instanceService
        .getUserInstanceById(role.instanceId, user.id)
        .recoverWith { case e: ServiceException => serviceErrorMapper(e) }
      job1 <- deleteRoleForPostgreSQL(role, user) if instance.engine == PostgreSQLEngineType
      job2 <- deleteRoleForMongoDB(role, instance, user) if instance.engine == MongoDBSQLEngineType
    } yield job1 ++ job2

  def deleteRoleForPostgreSQL(role: Role, user: User): Future[List[Int]] =
    for {
      job1 <- postgreSQLEngine
        .dropRoleComplete(role.name)
        .recoverWith { t: Throwable => internalError(t.getMessage) }
      job2 <- roleService
        .deleteRoleById(role.id, user.id)
        .recoverWith { case e: ServiceException => serviceErrorMapper(e) }
    } yield job1.toList ++ List(job2)

  def deleteRoleForMongoDB(role: Role, instance: Instance, user: User): Future[List[Int]] =
    for {
      job1 <- mongoDBEngine
        .deleteUser(instance.name, role.name)
        .recoverWith { t: Throwable => internalError(t.getMessage) }
      job2 <- roleService
        .deleteRoleById(role.id, user.id)
        .recoverWith { case e: ServiceException => serviceErrorMapper(e) }
    } yield List(job2)

  def serviceErrorMapper(exception: ServiceException): Future[Nothing] =
    exception match {
      case _: RoleService.Exceptions.AccessDenied      => Future.failed(Exceptions.AccessDenied())
      case _: RoleService.Exceptions.NotFound          => Future.failed(Exceptions.NotFound())
      case e: RoleService.Exceptions.InternalError     => Future.failed(Exceptions.InternalError(e.getMessage))
      case _: InstanceService.Exceptions.AccessDenied  => Future.failed(Exceptions.AccessDenied())
      case _: InstanceService.Exceptions.NotFound      => Future.failed(Exceptions.NotFound())
      case e: InstanceService.Exceptions.InternalError => Future.failed(Exceptions.InternalError(e.getMessage))

      case _: Throwable => internalError("Uncaught exception")
    }

  private def internalError(errorMessage: String): Future[Nothing] = {
    logger.error(errorMessage)
    Future.failed(Exceptions.InternalError(errorMessage))
  }

  private def generateRolePassword(length: Int = 8): String = {
    val algorithm = new SecureRandom
    val passwordChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray
    val password = new StringBuilder
    for (_ <- 0 to length)
      password.append(passwordChars(algorithm.nextInt(passwordChars.length)))
    password.toString
  }
}

object RoleManager {
  object Exceptions {
    sealed abstract class RoleManagerException(message: String) extends ManagerException(message)

    final case class NotFound(message: String = "Role not found") extends RoleManagerException(message)
    final case class AccessDenied(message: String = "Access denied. You are not the role owner")
        extends RoleManagerException(message)
    final case class InternalError(message: String = "Internal error") extends RoleManagerException(message)
  }
}
