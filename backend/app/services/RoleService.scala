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

  def addRole(createRoleFormData: CreateRoleFormData, user: User): Either[ErrorMessage, Role] = {
    // HINT: Check if user is the owner of the database
    instanceService.getInstance(createRoleFormData.instanceId, user.id) match {
      case Left(getInstanceThrowable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_CREATE_WRONG_PERMISSION,
          ErrorMessage.MESSAGE_ROLE_CREATE_WRONG_PERMISSION,
          developerMessage = getInstanceThrowable.developerMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Right(instance) =>
        createRoleFormData.roleName.startsWith(instance.name) match {
          case false =>
            val errorMessage = ErrorMessage(
              ErrorMessage.CODE_ROLE_CREATE_INVALID_NAME,
              ErrorMessage.MESSAGE_ROLE_CREATE_INVALID_NAME,
            )
            logger.error(errorMessage.toString)
            Left(errorMessage)
          case true =>
            val rolePassword = generateRolePassword()
            val localRole = Role(0, createRoleFormData.instanceId, createRoleFormData.roleName, rolePassword)
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

  def deleteRole(roleId: Long, user: User): Either[ErrorMessage, Int] = {
    Await.result(roleRepository.getRoleWithInstance(roleId), Duration.Inf) match {
      case Failure(getInstanceThrowable) =>
        val getRoleErrorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_GET_FAILED,
          ErrorMessage.MESSAGE_ROLE_GET_FAILED,
          developerMessage = getInstanceThrowable.getMessage
        )
        logger.warn(getRoleErrorMessage.toString)
        Left(getRoleErrorMessage)
      case Success(rolesWithInstance) if rolesWithInstance.exists(_._2.userId == user.id) =>
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
      case _ =>
        val getRoleErrorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_DELETE_WRONG_PERMISSION,
          ErrorMessage.MESSAGE_ROLE_DELETE_WRONG_PERMISSION,
        )
        logger.warn(getRoleErrorMessage.toString)
        Left(getRoleErrorMessage)
    }
  }

}
