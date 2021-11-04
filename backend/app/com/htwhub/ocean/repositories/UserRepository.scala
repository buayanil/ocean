package com.htwhub.ocean.repositories

import com.htwhub.ocean.concurrent.DatabaseContexts.DbWriteOperationsContext
import com.htwhub.ocean.concurrent.DatabaseContexts.ExpensiveDbLookupsContext
import com.htwhub.ocean.concurrent.DatabaseContexts.SimpleDbLookupsContext
import com.htwhub.ocean.models.User
import com.htwhub.ocean.models.UserId
import javax.inject.Inject
import javax.inject.Singleton
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import slick.jdbc.JdbcProfile

@Singleton
class UserRepository @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  class UserTable(tag: Tag) extends Table[User](tag, "users") {

    def id = column[UserId]("id", O.PrimaryKey, O.AutoInc)
    def username = column[String]("username")
    def firstName = column[String]("first_name")
    def lastName = column[String]("last_name")
    def mail = column[String]("mail")
    def employeeType = column[String]("employee_type")
    def * = (id, username, firstName, lastName, mail, employeeType) <> ((User.apply _).tupled, User.unapply)
  }

  val users = TableQuery[UserTable]

  def getUsers()(implicit
    expensiveDbLookupsContext: ExpensiveDbLookupsContext
  ): Future[Seq[User]] = dbConfig.db.run(
    users.result
  )

  def getUserById(userId: UserId)(implicit
    simpleDbLookupsContext: SimpleDbLookupsContext
  ): Future[Option[User]] =
    dbConfig.db.run(
      users.filter(_.id === userId).result.headOption
    )

  def getUserByUsername(username: String)(implicit
    simpleDbLookupsContext: SimpleDbLookupsContext
  ): Future[Option[User]] =
    dbConfig.db.run(
      users.filter(_.username === username).result.headOption
    )

  def addUser(user: User)(implicit dbWriteOperationsContext: DbWriteOperationsContext): Future[UserId] =
    dbConfig.db.run(
      users.returning(users.map(_.id)) += user
    )
}
