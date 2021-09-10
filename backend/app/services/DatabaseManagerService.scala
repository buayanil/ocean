package services

import forms.CreateRoleFormData
import models.{ErrorMessage, Instance, Role, User}
import play.api.Logger

import javax.inject.Inject
import scala.collection.mutable.ListBuffer

class DatabaseManagerService @Inject()(pgClusterService: PgClusterService, roleService: RoleService, instanceService: InstanceService) {

  val logger: Logger = Logger(this.getClass)

  def deleteDatabase(instanceId: Long, user: User): Either[List[ErrorMessage], Int] = {
    instanceService.getInstance(instanceId, user.id) match {
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL =>
        deletePostgresDatabase(instanceId, user, instance.name)
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
        deleteMongoDBDatabase(instanceId, user)
      case Left(value) => Left(List(value))
    }
  }

  def deletePostgresDatabase(instanceId: Long, user: User, databaseName: String): Either[List[ErrorMessage], Int] = {
    val errors = ListBuffer[ErrorMessage]()
    val roleNames: Seq[Role] = roleService.listInstanceRoles(instanceId, user) match {
      case Left(value) =>
        errors += value
        Seq()
      case Right(values) => values
    }
    // Delete cluster roles
    roleNames.foreach(role => pgClusterService.deleteRole(role.name) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    })
    // Delete postgres roles
    roleService.deleteDatabaseRoles(instanceId) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }
    // Delete instance
    instanceService.deleteInstance(instanceId, user.id) match {
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

  def deleteMongoDBDatabase(instanceId: Long, user: User): Either[List[ErrorMessage], Int] = {
    val errors = ListBuffer[ErrorMessage]()
    // Delete instance
    instanceService.deleteInstance(instanceId, user.id) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }
    errors match {
      case ListBuffer() => Right(1)
      case _ => Left(errors.toList)
    }
  }

  def addRole(createRoleFormData: CreateRoleFormData, user: User): Either[List[ErrorMessage], Role] = {
    //  Check if user is the owner of the database
    instanceService.getInstance(createRoleFormData.instanceId, user.id) match {
      case Left(value) => Left(List(value))
      case Right(instance) =>
        if (createRoleFormData.roleName.startsWith(instance.name)) {
          val rolePassword = roleService.generateRolePassword()
          val localRole = Role(0, createRoleFormData.instanceId, createRoleFormData.roleName, rolePassword)
          roleService.addRole(localRole) match {
            case Left(value) => Left(List(value))
            case Right(role) => pgClusterService.createSecuredRole(role.name, pgClusterService.GENERIC_GROUP_NAME, rolePassword) match {
              case Left(value) => Left(List(value))
              case Right(value) => pgClusterService.grantDatabaseAccess(role.name, instance.name) match {
                case Left(value) => Left(List(value))
                case Right(value) => Right(role)
              }
            }
          }
        } else {
          val errorMessage = ErrorMessage(
            ErrorMessage.CODE_ROLE_CREATE_INVALID_NAME,
            ErrorMessage.MESSAGE_ROLE_CREATE_INVALID_NAME
          )
          logger.error(errorMessage.toString)
          Left(List(errorMessage))
        }
    }
  }

  def deleteRole(roleId: Long): Either[List[ErrorMessage], Int] = {
    roleService.getRole(roleId) match {
      case Left(value) => Left(List(value))
      case Right(role) =>
        val errors = ListBuffer[ErrorMessage]()
        // Delete from cluster
        pgClusterService.deleteRole(role.name) match {
          case Left(value) => errors += value
          case Right(value) => Right(value)
        }
        // Delete from orm
        roleService.deleteRole(roleId) match {
          case Left(value) => errors += value
          case Right(value) => Right(value)
        }
        errors match {
          case ListBuffer() => Right(1)
          case _ => Left(errors.toList)
        }
    }
  }

}
