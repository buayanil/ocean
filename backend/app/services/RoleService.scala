package services

import java.security.SecureRandom
import javax.inject.Inject
import org.postgresql.util.PSQLException
import play.api.Logger
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

import forms.{CreateRoleFormData, RoleExistsFormData}
import models.{ErrorMessage, Role, User}
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

  def addRole(localRole: Role): Either[ErrorMessage, Role] = {
    Await.result(roleRepository.addRole(localRole), Duration.Inf) match {
      case Failure(createRoleThrowable) =>
        val errorMessage = handleAddRoleThrowable(createRoleThrowable)
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(role) => Right(role)
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

  def generateRolePassword(length: Int = 8): String = {
    val algorithm = new SecureRandom
    val passwordChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray
    val password = new StringBuilder
    for (_ <- 0 to length)
      password.append(passwordChars(algorithm.nextInt(passwordChars.length)))
    password.toString
  }

  def getRole(roleId: Long): Either[ErrorMessage, Role]  = {
    Await.result(roleRepository.getRole(roleId), Duration.Inf) match {
      case Failure(getRoleThrowable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_GET_FAILED,
          ErrorMessage.MESSAGE_ROLE_GET_FAILED,
          developerMessage = getRoleThrowable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(roles) if roles.nonEmpty => Right(roles.head)
      case _ =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_GET_FAILED,
          ErrorMessage.MESSAGE_ROLE_GET_FAILED,
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  def existsRole(roleExistsFormData: RoleExistsFormData, user: User): Either[ErrorMessage, Boolean] = {
    instanceService.getInstance(roleExistsFormData.instanceId, user.id) match {
      case Left(getInstanceThrowable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_EXISTS_WRONG_PERMISSION,
          ErrorMessage.MESSAGE_ROLE_EXISTS_WRONG_PERMISSION,
          developerMessage = getInstanceThrowable.developerMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Right(_) => Await.result(roleRepository.existsRole(roleExistsFormData.roleName, roleExistsFormData.instanceId), Duration.Inf) match {
        case Failure(existRoleThrowable) =>
          val errorMessage = ErrorMessage(
            ErrorMessage.CODE_ROLE_EXISTS_FAILED,
            ErrorMessage.MESSAGE_ROLE_EXISTS_FAILED,
            developerMessage = existRoleThrowable.getMessage
          )
          logger.error(errorMessage.toString)
          Left(errorMessage)
        case Success(exists) =>
          Right(exists)
      }
    }
  }

  def deleteRole(roleId: Long): Either[ErrorMessage, Int] = {
      Await.result(roleRepository.deleteRole(roleId), Duration.Inf) match {
        case Success(rows) => Right(rows)
        case Failure(deleteRoleThrowable) =>
          val getRoleErrorMessage = ErrorMessage(
            ErrorMessage.CODE_ROLE_DELETE_FAILED,
            ErrorMessage.MESSAGE_ROLE_DELETE_FAILED,
            developerMessage = deleteRoleThrowable.getMessage
          )
          logger.warn(getRoleErrorMessage.toString)
          Left(getRoleErrorMessage)
      }
  }

  def deleteDatabaseRoles(instanceId: Long): Either[ErrorMessage, Int] = {
    Await.result(roleRepository.deleteDatabaseRoles(instanceId), Duration.Inf) match {
      case Success(rows) => Right(rows)
      case Failure(deleteRolesThrowable) =>
        val deleteRolesErrorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLES_DATABASE_DELETE_FAILED,
          ErrorMessage.MESSAGE_ROLE_DATABASE_DELETE_FAILED,
          developerMessage = deleteRolesThrowable.getMessage
        )
        logger.warn(deleteRolesErrorMessage.toString)
        Left(deleteRolesErrorMessage)
    }
  }
}
