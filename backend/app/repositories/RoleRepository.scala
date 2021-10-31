package repositories

import javax.inject.Inject
import javax.inject.Singleton
import models.Instance
import models.Role
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import scala.util.Try
import slick.jdbc.JdbcProfile

@Singleton
class RoleRepository @Inject() (dbConfigProvider: DatabaseConfigProvider, instanceRepository: InstanceRepository)(
  implicit ec: ExecutionContext
) {

  private val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  private val roles = TableQuery[RoleTable]

  private class RoleTable(tag: Tag) extends Table[Role](tag, "roles") {

    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def instanceId = column[Long]("instance_id")

    def name = column[String]("name")

    def password = column[String]("password")

    def * =
      (id, instanceId, name, password) <> ((Role.apply _).tupled, Role.unapply)

    def idx = index("idx_instanceId_name", (instanceId, name), unique = true)

    /** OneToMany relationship using a foreign key constraint.
      */
    def fkInstance =
      foreignKey("roles_fk_instance_id", instanceId, roles)(_.id, onDelete = ForeignKeyAction.Cascade)
  }

  def listDatabaseRoles(instanceId: Long): Future[Try[Seq[Role]]] = {
    val action = roles.filter(role => role.instanceId === instanceId).result.asTry
    dbConfig.db.run(action)
  }

  def addRole(role: Role): Future[Try[Role]] = {
    val createRoleQuery = roles returning roles.map(_.id) into ((item, id) => item.copy(id = id))
    val action = (createRoleQuery += role).asTry
    dbConfig.db.run(action)
  }

  def existsRole(roleName: String, instanceId: Long): Future[Try[Boolean]] = {
    val existRoleStatement =
      roles.filter(role => role.name === roleName && role.instanceId === instanceId).exists.result.asTry
    dbConfig.db.run(existRoleStatement)
  }

  def getRole(roleId: Long): Future[Try[Seq[Role]]] = {
    val action = roles.filter(role => role.id === roleId).result.asTry
    dbConfig.db.run(action)
  }

  def getRoleWithInstance(roleId: Long): Future[Try[Seq[(Role, Instance)]]] = {
    val getRoleWithInstanceStatement =
      roles.filter(_.id === roleId).join(instanceRepository.instances).on((a, b) => a.instanceId === b.id).result.asTry
    dbConfig.db.run(getRoleWithInstanceStatement)
  }

  def deleteRole(roleId: Long): Future[Try[Int]] = {
    val deleteRoleStatement = roles.filter(_.id === roleId).delete.asTry
    dbConfig.db.run(deleteRoleStatement)
  }

  def deleteDatabaseRoles(instanceId: Long): Future[Try[Int]] = {
    val deleteDatabaseRolesStatement = roles.filter(_.instanceId === instanceId).delete.asTry
    dbConfig.db.run(deleteDatabaseRolesStatement)
  }
}
