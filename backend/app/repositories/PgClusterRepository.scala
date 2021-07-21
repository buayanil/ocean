package repositories

import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try


@Singleton
class PgClusterRepository @Inject() ()(implicit ec: ExecutionContext) {

  import slick.jdbc.PostgresProfile.api._

  val db = Database.forConfig("pg_cluster")

  def createDatabase(databaseName: String, ownerName: String): Future[Try[Vector[Int]]] = {
    val createDatabaseStatement = sql"""CREATE DATABASE #${databaseName} WITH OWNER #${ownerName}"""
    db.run(createDatabaseStatement.as[Int].asTry)
  }

  def createRole(roleName: String): Future[Try[Vector[Int]]] = {
    val createRoleStatement = sql"""CREATE ROLE #${roleName} WITH NOSUPERUSER LOGIN CONNECTION LIMIT 500"""
    db.run(createRoleStatement.as[Int].asTry)
  }

  def deleteDatabase(databaseName: String) = {
    val deleteDatabaseStatement = sql"""DROP DATABASE IF EXISTS #${databaseName}"""
    db.run(deleteDatabaseStatement.as[Int].asTry)
  }
}