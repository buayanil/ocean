package repositories

import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
import slick.jdbc.JdbcProfile

import models.Role



@Singleton
class RoleRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  private val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  private val roles = TableQuery[RoleTable]

  private class RoleTable(tag: Tag) extends Table[Role](tag, "roles") {

    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def instanceId = column[Long]("instance_id")

    def name = column[String]("name")

    def * =
      (id, instanceId, name) <> ((Role.apply _).tupled, Role.unapply)

    def idx = index("idx_instanceId_name", (instanceId, name), unique = true)

    /**
     * OneToMany relationship using a foreign key constraint.
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
}

