package services

import javax.inject.Inject
import models.ErrorMessage
import models.User
import play.api.Logger
import repositories.UserRepository
import scala.concurrent.duration.Duration
import scala.concurrent.Await
import scala.util.Failure
import scala.util.Success
import services.cluster.PgClusterService

class UserService @Inject() (
  ldapService: LdapService,
  tokenService: TokenService,
  userRepository: UserRepository,
  pgClusterService: PgClusterService
) {

  val logger: Logger = Logger(this.getClass)

  def login(username: String, password: String): Either[List[ErrorMessage], String] =
    ldapService.authenticate(username, password) match {
      case Left(errors) =>
        logger.warn(errors.toString)
        Left(errors)
      case Right(ldapUser) =>
        Await.result(userRepository.getByUsername(ldapUser.username), Duration.Inf) match {
          case Some(user) => Right(tokenService.encode(user.username))
          case None =>
            Await.result(userRepository.addUser(ldapUser), Duration.Inf) match {
              case user =>
                pgClusterService.createRole(user.username, pgClusterService.LDAP_GROUP_NAME) match {
                  case Left(errorMessage: ErrorMessage) =>
                    logger.error(errorMessage.toString)
                    Left(List(errorMessage))
                  case _ => Right(tokenService.encode(user.username))
                }
            }
        }
    }

  def getUserById(userId: Long): Either[ErrorMessage, User] =
    Await.result(userRepository.getUserById(userId), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_USER_GET_FAILED,
          ErrorMessage.MESSAGE_USER_GET_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(users) if users.nonEmpty => Right(users.head)
      case _ =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_USER_GET_FAILED,
          ErrorMessage.MESSAGE_USER_GET_FAILED,
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }

  def getAll: Either[ErrorMessage, Seq[User]] =
    Await.result(userRepository.getAll, Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_USER_LIST_FAILED,
          ErrorMessage.MESSAGE_USER_LIST_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(users) => Right(users)
    }

  def getAllForPattern(pattern: String): Either[ErrorMessage, Seq[User]] =
    Await.result(userRepository.getAllForPattern(pattern), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_USER_LIST_FAILED,
          ErrorMessage.MESSAGE_USER_LIST_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(users) => Right(users)
    }
}
