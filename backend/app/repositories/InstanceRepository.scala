package repositories

import javax.inject.{Inject, Singleton}
import java.sql.Timestamp
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
import slick.jdbc.JdbcProfile
import slick.sql.SqlProfile.ColumnOption.SqlType

import models.Instance


@Singleton
class InstanceRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  private val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._


  private class InstanceTable(tag: Tag) extends Table[Instance](tag, "instances") {

    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def userId = column[Long]("user_id")

    def name = column[String]("name")

    def engine = column[String]("engine")

    def createdAt = column[Timestamp]("created_at", SqlType("timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP"))

    /**
     * Custom projection for mapping tables.
     */
    def * =
      (id, userId, name, engine, createdAt) <> ((Instance.apply _).tupled, Instance.unapply)

    /**
     * Avoids duplicated names in each engine type using a compound primary key constraint.
     */
    def idx = index("idx_name_engine", (name, engine), unique = true)

    /**
     * OneToMany relationship using a foreign key constraint.
     */
    def user =
      foreignKey("users", userId, TableQuery[InstanceTable])(_.id, onDelete = ForeignKeyAction.Cascade)
  }

  private val instances = TableQuery[InstanceTable]

  def listAll(userId: Long): Future[Try[Seq[Instance]]] = {
    val action = instances.filter(database => database.userId === userId).result.asTry
    dbConfig.db.run(action)
  }

  def get(id: Long, userId: Long): Future[Try[Seq[Instance]]] = {
    val action = instances.filter(_.id === id).filter(_.userId === userId).result.asTry
    dbConfig.db.run(action)
  }

  def addInstance(instance: Instance): Future[Try[Instance]] = {
    val insertQuery = instances returning instances.map(_.id) into ((item, id) => item.copy(id = id))
    val action = (insertQuery += instance).asTry
    dbConfig.db.run(action)
  }

  def exists(name: String, engine: String): Future[Try[Boolean]] = {
    val action = instances.filter(instance => instance.name === name && instance.engine === engine).exists.result.asTry
    dbConfig.db.run(action)
  }

  def deleteInstance(id: Long, userId: Long): Future[Try[Int]] = {
    val action = instances.filter(_.id === id).filter(_.userId === userId).delete.asTry
    dbConfig.db.run(action)
  }

}

