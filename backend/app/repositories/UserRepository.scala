package repositories

import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import scala.util.Try
import scala.concurrent.{ExecutionContext, Future}

import models.User


@Singleton
class UserRepository @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._


  class UserTable(tag: Tag) extends Table[User](tag, "users") {

    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def username = column[String]("username")
    def firstName = column[String]("first_name")
    def lastName = column[String]("last_name")
    def mail = column[String]("mail")
    def employeeType = column[String]("employee_type")

    def * = (id, username, firstName, lastName, mail, employeeType) <> ((User.apply _).tupled, User.unapply)
  }

  val users = TableQuery[UserTable]

  def getByUsername(username: String): Future[Option[User]] = db.run {
    users.filter(user => user.username === username).result.headOption
  }

  def getUserById(userId: Long): Future[Try[Seq[User]]] = {
    val action = users.filter(_.id === userId).result.asTry
    dbConfig.db.run(action)
  }

  // TODO: use asTry
  def addUser(user: User): Future[User] = {
    val insertQuery = users returning users.map(_.id) into ((item, id) => item.copy(id = id))
    val action = (insertQuery += user)
    dbConfig.db.run(action)
  }

  def create(username: String, firstname: String, lastName: String, mail: String, employeeType: String): Future[User] = db.run {
    (users.map(p => (p.username, p.firstName, p.lastName, p.mail, p.employeeType))
      returning users.map(_.id)
      into ((entry, id) => User(id, entry._1, entry._2, entry._3, entry._4, entry._5))
      ) += (username, firstname, lastName, mail, employeeType)
  }
}