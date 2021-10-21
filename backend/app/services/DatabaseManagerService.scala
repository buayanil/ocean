package services

import forms.{CreateInstanceFormData, CreateRoleFormData}
import models.{ErrorMessage, Instance, Role, User}
import play.api.Logger

import java.sql.Timestamp
import java.time.Instant
import javax.inject.Inject
import scala.collection.mutable.ListBuffer

class DatabaseManagerService @Inject()(pgClusterService: PgClusterService, roleService: RoleService, instanceService: InstanceService, invitationService: InvitationService, userService: UserService) {

  val logger: Logger = Logger(this.getClass)

  def addInstance(createInstanceFormData: CreateInstanceFormData, user: User): Either[List[ErrorMessage], Instance] = {
    val localTimestamp = Timestamp.from(Instant.now)
    val localInstance = Instance(0, user.id, createInstanceFormData.name, createInstanceFormData.engine, localTimestamp)
    instanceService.addInstance(localInstance) match {
      case Left(errorMessage) => Left(List(errorMessage))
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL =>
        pgClusterService.createDatabase(instance.name, user.username) match {
          case Left(errorMessage) => Left(List(errorMessage))
          case Right(_) => Right(instance)
        }
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
        // TODO: NotImplementedYet
        Right(instance)
    }
  }

  def deleteDatabase(instanceId: Long, user: User): Either[List[ErrorMessage], Int] = {
    instanceService.getInstance(instanceId, user.id) match {
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL =>
        deletePostgresDatabase(instance, user, instance.name)
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
        deleteMongoDBDatabase(instanceId, user)
      case Left(value) => Left(List(value))
    }
  }

  def deletePostgresDatabase(instance: Instance, user: User, databaseName: String): Either[List[ErrorMessage], Int] = {
    val errors = ListBuffer[ErrorMessage]()
    // Roles
    val roleNames: Seq[Role] = roleService.listInstanceRoles(instance.id, user) match {
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
    // Delete orm roles
    roleService.deleteDatabaseRoles(instance.id) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    // Invitations
    val invitations = invitationService.getAllForInstance(instance.id) match {
      case Left(value) =>
        errors += value
        Seq()
      case Right(values) => values
    }
    // Delete cluster invitations
    invitations.foreach(invitation => userService.getUserById(invitation.userId) match {
      case Left(value) =>
        errors += value
        Seq()
      case Right(revokeUser) => pgClusterService.removeDatabaseAccess(revokeUser.username, instance.name)
    })
    // Delete orm invitations
    invitationService.deleteDatabaseInvitations(instance.id) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    // Delete instance
    instanceService.deleteInstance(instance.id, user.id) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }
    // Delete orm database
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
