package services

import org.specs2.mutable._
import org.specs2.mock.Mockito
import scala.concurrent.Future

import models.{LdapUser, User}
import repositories.UserRepository


class UserServiceSpec extends Specification with Mockito {

  "UserService#login" should {
    "return a token if the user is valid and already in the database" in {
      // Arrange
      val user = User(id=1, "username", "firstName", "lastName", "mail", "employeeType")
      val ldapUser = LdapUser("username", "firstName", "lastName", "mail", "employeeType")
      val userRepository = mock[UserRepository]
      userRepository.getByUsername(any[String]).returns(Future.successful(Some(user)))
      val ldapService = mock[LdapService]
      ldapService.authenticate(any[String], any[String]).returns(Right(ldapUser))
      val tokenService = mock[TokenService]
      tokenService.encode(any[String]).returns("token")
      val userService = new UserService(ldapService, tokenService, userRepository)

      // Act
      val actual = userService.login("username", "password")

      // Assert
      (actual must be).equalTo(Right("token"))
    }

    "return a token if the user is valid and needs to be created" in {
      // Arrange
      val user = User(id=1, "username", "firstName", "lastName", "mail", "employeeType")
      val ldapUser = LdapUser("username", "firstName", "lastName", "mail", "employeeType")
      val userRepository = mock[UserRepository]
      userRepository.getByUsername(any[String]).returns(Future.successful(None))
      userRepository.create(any[String], any[String], any[String], any[String], any[String]).returns(Future.successful(user))
      val ldapService = mock[LdapService]
      ldapService.authenticate(any[String], any[String]).returns(Right(ldapUser))
      val tokenService = mock[TokenService]
      tokenService.encode(any[String]).returns("token")
      val userService = new UserService(ldapService, tokenService, userRepository)

      // Act
      val actual = userService.login("username", "password")

      // Assert
      (actual must be).equalTo(Right("token"))
    }

    "fail if the user is invalid" in {
      // Arrange
      val userRepository = mock[UserRepository]
      val ldapService = mock[LdapService]
      ldapService.authenticate(any[String], any[String]).returns(Left(List("error")))
      val tokenService = mock[TokenService]
      val userService = new UserService(ldapService, tokenService, userRepository)

      // Act
      val actual = userService.login("username", "password")

      // Assert
      (actual must be).equalTo(Left(List("error")))
    }
  }
}