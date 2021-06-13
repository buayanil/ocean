package services

import javax.inject.Inject
import scala.concurrent.Await
import scala.concurrent.duration.Duration

import repositories.UserRepository

class UserService @Inject()(ldapService: LdapService, userRepository: UserRepository) {

  def login(username: String, password: String): Either[List[String], Boolean] = {
    ldapService.authenticate(username, password) match {
      case Left(errors) => Left(errors)
      case Right(ldapUser) => Await.result(userRepository.getByUsername(ldapUser.username), Duration.Inf) match {
        case None => Right(true)
        case Some(user) => Right(true)
      }
    }
  }

}
