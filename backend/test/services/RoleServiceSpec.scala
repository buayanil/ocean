package services

import org.specs2.mutable._
import org.specs2.mock.Mockito
import java.sql.Timestamp
import java.time.Instant
import scala.concurrent.Future
import scala.util.Success

import models.{ErrorMessage, Instance, Role, User}
import repositories.RoleRepository


class RoleServiceSpec extends Specification with Mockito {

  "RoleService#listDatabaseRoles" should {
    "return an error if the user is not the owner of the database" in {
      // Arrange
      val user = User(1, "", "", "", "", "")
      val roleRepository = mock[RoleRepository]
      val instanceService = mock[InstanceService]
      instanceService.getInstance(any[Long], any[Long]).returns(Left(ErrorMessage("", "")))
      val roleService = new RoleService(roleRepository, instanceService)

      // Act
      val actual = roleService.listInstanceRoles(1, user)

      // Assert
      (actual.isLeft must be).equalTo(true)
    }

    "returns a list of roles for a database" in {
      // Arrange
      val user = User(1, "", "", "", "", "")
      val instance = Instance(1, 1, "", "", Timestamp.from(Instant.now))
      val role = Role(1, 1, "", "")
      val roleRepository = mock[RoleRepository]
      roleRepository.listDatabaseRoles(any[Long]).returns(Future.successful(Success(List(role))))
      val instanceService = mock[InstanceService]
      instanceService.getInstance(any[Long], any[Long]).returns(Right(instance))
      val roleService = new RoleService(roleRepository, instanceService)

      // Act
      val actual = roleService.listInstanceRoles(1, user)

      // Assert
      (actual.isRight must be).equalTo(true)
    }
  }

  "RoleService#addRole" should {
    "returns the added role" in {
      // Arrange
      val instance = Instance(1, 1, "", "", Timestamp.from(Instant.now))
      val role = Role(1, 1, "", "")
      val roleRepository = mock[RoleRepository]
      roleRepository.addRole(any[Role]).returns(Future.successful(Success(role)))
      val instanceService = mock[InstanceService]
      instanceService.getInstance(any[Long], any[Long]).returns(Right(instance))
      val roleService = new RoleService(roleRepository, instanceService)

      // Act
      val actual = roleService.addRole(Role(1, 1, "name", "password"))

      // Assert
      (actual.isRight must be).equalTo(true)
    }
  }
}