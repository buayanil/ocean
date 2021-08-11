package services

import javax.inject.Inject
import play.api.Logger
import scala.concurrent.Await
import scala.concurrent.duration.Duration

import repositories.UserRepository
import models.{ErrorMessage, LdapUser, User}


class UserService @Inject()(ldapService: LdapService, tokenService: TokenService, userRepository: UserRepository, pgClusterService: PgClusterService) {

  val logger: Logger = Logger(this.getClass)

  def login(username: String, password: String): Either[List[ErrorMessage], String] = {
    ldapService.authenticate(username, password) match {
      case Left(errors) =>
        logger.warn(errors.toString)
        Left(errors)
      case Right(ldapUser) => Await.result(userRepository.getByUsername(ldapUser.username), Duration.Inf) match {
        case Some(user) => Right(tokenService.encode(user.username))
        case None => Await.result(
          userRepository.addUser(getUserFor(ldapUser)), Duration.Inf) match {
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
  }

  private def getUserFor(ldapUser: LdapUser): User = {
    User(0L, ldapUser.username, ldapUser.firstName, ldapUser.lastName, ldapUser.mail, ldapUser.employeeType)
  }

}
