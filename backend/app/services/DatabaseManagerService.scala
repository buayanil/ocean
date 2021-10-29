package services

import java.sql.Timestamp
import java.time.Instant
import javax.inject.Inject
import scala.collection.mutable.ListBuffer

import forms.CreateInstanceFormData
import models.{ErrorMessage, Instance, Role, User}
import play.api.Logger
import services.cluster.{MongoDBClusterService, PgClusterService}

class DatabaseManagerService @Inject()(pgClusterService: PgClusterService, mongoDBClusterService: MongoDBClusterService, roleService: RoleService, instanceService: InstanceService, invitationService: InvitationService, userService: UserService) {

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
        mongoDBClusterService.createDatabase(instance.name) match {
          case Left(errorMessage) => Left(List(errorMessage))
          case Right(_) => Right(instance)
        }
    }
  }

  def deleteDatabase(instanceId: Long, user: User): Either[List[ErrorMessage], Int] = {
    instanceService.getInstance(instanceId, user.id) match {
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL =>
        deletePostgresDatabase(instance, user)
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
        deleteMongoDBDatabase(instance, user)
      case Left(value) => Left(List(value))
    }
  }

  def deletePostgresDatabase(instance: Instance, user: User): Either[List[ErrorMessage], Int] = {
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

    // Delete orm database
    pgClusterService.deleteDatabase(instance.name) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    // Delete instance
    instanceService.deleteInstance(instance.id, user.id) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    errors match {
      case ListBuffer() => Right(1)
      case _ => Left(errors.toList)
    }
  }

  def deleteMongoDBDatabase(instance: Instance, user: User): Either[List[ErrorMessage], Int] = {
    val errors = ListBuffer[ErrorMessage]()
    // Roles
    val roleNames: Seq[Role] = roleService.listInstanceRoles(instance.id, user) match {
      case Left(value) =>
        errors += value
        Seq()
      case Right(values) => values
    }
    // Delete cluster roles
    roleNames.foreach(role => mongoDBClusterService.deleteUser(instance.name, role.name) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    })
    // Delete orm roles
    roleService.deleteDatabaseRoles(instance.id) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    // Delete cluster database
    mongoDBClusterService.deleteDatabase(instance.name) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    // Delete instance
    instanceService.deleteInstance(instance.id, user.id) match {
      case Left(value) => errors += value
      case Right(value) => Right(value)
    }

    errors match {
      case ListBuffer() => Right(1)
      case _ => Left(errors.toList)
    }
  }

}
