package services

import forms.CreateRoleFormData

import javax.inject.Inject
import play.api.Logger
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

import models.{ErrorMessage, Role, User}
import org.postgresql.util.PSQLException
import repositories.RoleRepository


class RoleService @Inject()(roleRepository: RoleRepository, instanceService: InstanceService) {

  val logger: Logger = Logger(this.getClass)

  def listInstanceRoles(instanceId: Long, user: User): Either[ErrorMessage, Seq[Role]] = {
    // HINT: Check if the user is owner of the database
    instanceService.getInstance(instanceId, user.id) match {
      case Left(getInstanceThrowable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_LIST_WRONG_PERMISSION,
          ErrorMessage.MESSAGE_ROLE_LIST_WRONG_PERMISSION,
          developerMessage = getInstanceThrowable.developerMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Right(instance) =>
        Await.result(roleRepository.listDatabaseRoles(instanceId), Duration.Inf) match {
          case Failure(exception) =>
            val errorMessage = ErrorMessage(
              ErrorMessage.CODE_ROLE_LIST_FAILED,
              ErrorMessage.MESSAGE_ROLE_FAILED,
              developerMessage = exception.getMessage
            )
            logger.error(errorMessage.toString)
            Left(errorMessage)
          case Success(roles) => Right(roles)
        }
    }
  }

  def addRole(createInstanceFormData: CreateRoleFormData, user: User): Either[ErrorMessage, Role] = {
    // HINT: Check if user is the owner of the database
    instanceService.getInstance(createInstanceFormData.instanceId, user.id) match {
      case Left(getInstanceThrowable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_CREATE_WRONG_PERMISSION,
          ErrorMessage.MESSAGE_ROLE_CREATE_WRONG_PERMISSION,
          developerMessage = getInstanceThrowable.developerMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Right(_) =>
        val localRole = Role(0, createInstanceFormData.instanceId, createInstanceFormData.name)
        Await.result(roleRepository.addRole(localRole), Duration.Inf) match {
          case Failure(createRoleThrowable) =>
            val errorMessage = handleAddRoleThrowable(createRoleThrowable)
            logger.error(errorMessage.toString)
            Left(errorMessage)
          case Success(role) =>
            // TODO: actual add the role to the cluster
            Right(role)
        }
    }
  }

  private def handleAddRoleThrowable(exception: Throwable): ErrorMessage = {
    exception match {
      case exception: PSQLException if exception.getMessage.contains("duplicate key value") =>
        ErrorMessage(
          ErrorMessage.CODE_ROLE_CREATE_CONSTRAINT_ERROR,
          ErrorMessage.MESSAGE_ROLE_CREATE_CONSTRAINT_ERROR,
          developerMessage = exception.getMessage
        )
      case exception: Throwable =>
        ErrorMessage(
          ErrorMessage.CODE_ROLE_CREATE_FAILED,
          ErrorMessage.MESSAGE_ROLE_CREATE_FAILED,
          developerMessage = exception.getMessage
        )
    }
  }
}
