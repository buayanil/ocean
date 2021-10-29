package services


import javax.inject.Inject
import play.api.Logger
import scala.collection.mutable.ListBuffer

import forms.CreateRoleFormData
import models.{ErrorMessage, Instance, Role, User}
import services.cluster.{MongoDBClusterService, PgClusterService}

class RoleManagerService @Inject()(pgClusterService: PgClusterService,
                                   mongoDBClusterService: MongoDBClusterService,
                                   roleService: RoleService,
                                   instanceService: InstanceService) {

  val logger: Logger = Logger(this.getClass)


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
            case Right(role) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL =>
              pgClusterService.createSecuredRole(role.name, pgClusterService.GENERIC_GROUP_NAME, rolePassword) match {
                case Left(value) => Left(List(value))
                case Right(value) => pgClusterService.grantDatabaseAccess(role.name, instance.name) match {
                  case Left(value) => Left(List(value))
                  case Right(value) => Right(role)
              }
            }
            case Right(role) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
              mongoDBClusterService.createUser(instance.name, role.name, role.password) match {
                case Left(value) => Left(List(value))
                case Right(value) => Right(role)
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

  def deleteRole(roleId: Long, user: User): Either[List[ErrorMessage], Int] = {
    roleService.getRole(roleId) match {
      case Left(value) => Left(List(value))
      case Right(role) => instanceService.getInstance(role.instanceId, user.id) match {
        case Left(value) => Left(List(value))
        case Right(instance) =>
          val errors = ListBuffer[ErrorMessage]()
          instance.engine match {
            case engine if engine == Instance.ENGINE_TYPE_POSTGRESQL =>
              // Delete from cluster
              pgClusterService.deleteRole(role.name) match {
                case Left(value) => errors += value
                case Right(value) => Right(value)
              }
            case engine if engine == Instance.ENGINE_TYPE_MONGODB =>
              mongoDBClusterService.deleteUser(instance.name, role.name) match {
                case Left(value) => errors += value
                case Right(value) => Right(value)
              }
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

}
