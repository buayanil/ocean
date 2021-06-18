package repositories

import models.User

import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import scala.concurrent.{ExecutionContext, Future}


@Singleton
class UserRepository @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  private val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._


  private class UserTable(tag: Tag) extends Table[User](tag, "users") {

    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def username = column[String]("username")
    def firstName = column[String]("first_name")
    def lastName = column[String]("last_name")
    def mail = column[String]("mail")
    def employeeType = column[String]("employee_type")

    def * = (id, username, firstName, lastName, mail, employeeType) <> ((User.apply _).tupled, User.unapply)
  }

  private val users = TableQuery[UserTable]

  def list(): Future[Seq[User]] = db.run {
    users.result
  }

  def getByUsername(username: String): Future[Option[User]] = db.run {
    users.filter(user => user.username === username).result.headOption
  }

  def create(username: String, firstname: String, lastName: String, mail: String, employeeType: String): Future[User] = db.run {
    (users.map(p => (p.username, p.firstName, p.lastName, p.mail, p.employeeType))
      returning users.map(_.id)
      into ((nameAge, id) => User(id, nameAge._1, nameAge._2, nameAge._3, nameAge._4, nameAge._5))
      ) += (username, firstname, lastName, mail, employeeType)
  }

}