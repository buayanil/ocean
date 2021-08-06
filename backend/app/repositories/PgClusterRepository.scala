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
    val revokePublicAccessStatement = sql"""REVOKE ALL ON DATABASE #${databaseName} FROM PUBLIC"""
    val revokeDeleteFromOwner = sql"""REVOKE CONNECT ON DATABASE #${databaseName} FROM #${ownerName}"""
    db.run(createDatabaseStatement.as[Int].asTry andThen
      revokePublicAccessStatement.as[Int].asTry andThen
      revokeDeleteFromOwner.as[Int].asTry
    )
  }

  def deleteDatabase(databaseName: String): Future[Try[Vector[Int]]] = {
    val deleteDatabaseStatement = sql"""DROP DATABASE IF EXISTS #${databaseName}"""
    db.run(deleteDatabaseStatement.as[Int].asTry)
  }

  def createRole(roleName: String): Future[Try[Vector[Int]]] = {
    val createRoleStatement = sql"""CREATE ROLE #${roleName} WITH NOSUPERUSER LOGIN CONNECTION LIMIT 500"""
    db.run(createRoleStatement.as[Int].asTry)
  }

  def existsRole(roleName: String): Future[Try[Vector[Int]]] = {
    val existsDatabaseStatement = sql"""SELECT 1 FROM pg_roles WHERE rolname='#${roleName}'"""
    db.run(existsDatabaseStatement.as[Int].asTry)
  }
}