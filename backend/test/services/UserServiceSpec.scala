package services

import org.specs2.mutable._
import org.specs2.mock.Mockito
import scala.concurrent.Future

import models.{LdapUser, User}
import repositories.UserRepository


class UserServiceSpec extends Specification with Mockito {
  "UserService#login" should {
    "be true when the user is valid and already in the database" in {
      // Arrange
      val user = User(id=1, "username", "firstName", "lastName", "mail", "employeeType")
      val ldapUser = LdapUser("username", "firstName", "lastName", "mail", "employeeType")
      val userRepository = mock[UserRepository]
      val ldapService = mock[LdapService]
      userRepository.getByUsername(any[String]).returns(Future.successful(Some(user)))
      ldapService.authenticate(any[String], any[String]).returns(Right(ldapUser))
      val userService = new UserService(ldapService, userRepository)

      // Act
      val actual = userService.login("username", "password")

      // Assert
      (actual must be).equalTo(Right(true))
    }
  }
}