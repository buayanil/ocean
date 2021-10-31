package services

import models.ErrorMessage
import models.User
import org.specs2.mock.Mockito
import org.specs2.mutable._
import repositories.UserRepository
import scala.concurrent.Future
import services.cluster.PgClusterService

class UserServiceSpec extends Specification with Mockito {

  "UserService#login" should {
    "return a token if the user is valid and already in the database" in {
      // Arrange
      val user = User(id = 1, "username", "firstName", "lastName", "mail", "employeeType")
      val ldapUser = User(0L, "username", "firstName", "lastName", "mail", "employeeType")
      val userRepository = mock[UserRepository]
      userRepository.getByUsername(any[String]).returns(Future.successful(Some(user)))
      val ldapService = mock[LdapService]
      ldapService.authenticate(any[String], any[String]).returns(Right(ldapUser))
      val tokenService = mock[TokenService]
      tokenService.encode(any[String], any[Long]).returns("token")
      val pgClusterService = mock[PgClusterService]

      val userService = new UserService(ldapService, tokenService, userRepository, pgClusterService)

      // Act
      val actual = userService.login("username", "password")

      // Assert
      (actual must be).equalTo(Right("token"))
    }

    "return a token if the user is valid and needs to be created" in {
      // Arrange
      val user = User(id = 1, "username", "firstName", "lastName", "mail", "employeeType")
      val ldapUser = User(0L, "username", "firstName", "lastName", "mail", "employeeType")
      val userRepository = mock[UserRepository]
      userRepository.getByUsername(any[String]).returns(Future.successful(None))
      userRepository.addUser(any[User]).returns(Future.successful(user))
      val ldapService = mock[LdapService]
      ldapService.authenticate(any[String], any[String]).returns(Right(ldapUser))
      val tokenService = mock[TokenService]
      tokenService.encode(any[String], any[Long]).returns("token")
      val pgClusterService = mock[PgClusterService]
      val userService = new UserService(ldapService, tokenService, userRepository, pgClusterService)

      // Act
      val actual = userService.login("username", "password")

      // Assert
      (actual must be).equalTo(Right("token"))
    }

    "fail if the user is invalid" in {
      // Arrange
      val userRepository = mock[UserRepository]
      val ldapService = mock[LdapService]
      ldapService.authenticate(any[String], any[String]).returns(Left(List(ErrorMessage("", ""))))
      val tokenService = mock[TokenService]
      val pgClusterService = mock[PgClusterService]
      val userService = new UserService(ldapService, tokenService, userRepository, pgClusterService)

      // Act
      val actual = userService.login("username", "password")

      // Assert
      (actual must be).equalTo(Left(List(ErrorMessage("", ""))))
    }
  }
}
