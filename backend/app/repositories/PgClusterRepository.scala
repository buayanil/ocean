package repositories

import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try


@Singleton
class PgClusterRepository @Inject() ()(implicit ec: ExecutionContext) {

  import slick.jdbc.PostgresProfile.api._

  val db = Database.forConfig("pg_cluster")

  /**
   * Creates a database, revokes public access and grants a role access
   * @param databaseName name of database
   * @param ownerName name of owner
   */
  def createDatabase(databaseName: String, roleName: String): Future[Try[Vector[Int]]] = {
    val createDatabaseStatement = sql"""CREATE DATABASE #${databaseName}"""
    val revokePublicAccessStatement = sql"""REVOKE ALL ON DATABASE #${databaseName} FROM PUBLIC"""
    val grantDatabaseAccessStatement = sql"""GRANT ALL PRIVILEGES ON DATABASE #${databaseName} to #${roleName}"""
    db.run(
      createDatabaseStatement.as[Int].asTry andThen
      revokePublicAccessStatement.as[Int].asTry andThen
      grantDatabaseAccessStatement.as[Int].asTry
    )
  }

  def deleteDatabase(databaseName: String): Future[Try[Vector[Int]]] = {
    val deleteDatabaseStatement = sql"""DROP DATABASE IF EXISTS #${databaseName}"""
    db.run(deleteDatabaseStatement.as[Int].asTry)
  }

  /**
   * Creates a role with login permission and group membership.
   * @param roleName name of role
   * @param groupName name of group
   */
  def createRole(roleName: String, groupName: String): Future[Try[Vector[Int]]] = {
    val createRoleStatement = sql"""CREATE ROLE #${roleName} WITH NOSUPERUSER LOGIN CONNECTION LIMIT 500 IN ROLE #${groupName}"""
    db.run(createRoleStatement.as[Int].asTry)
  }

  /**
   * Creates a role with password, login permission and group membership
   * @param roleName name of role
   * @param groupName name of group
   * @param password password
   */
  def createSecuredRole(roleName: String, groupName: String, password: String): Future[Try[Vector[Int]]] = {
    val createRoleWithPasswordStatement = sql"""CREATE ROLE #${roleName} WITH NOSUPERUSER LOGIN CONNECTION LIMIT 500 IN ROLE #${groupName} PASSWORD '#${password}'"""
    db.run(createRoleWithPasswordStatement.as[Int].asTry)
  }

  /**
   * Creates a group as a role without login permissions.
   * @param groupName name of group
   */
  def createGroup(groupName: String): Future[Try[Vector[Int]]] = {
    val createRoleStatement = sql"""CREATE ROLE #${groupName} WITH NOSUPERUSER"""
    db.run(createRoleStatement.as[Int].asTry)
  }

  def existsRole(roleName: String): Future[Try[Vector[Int]]] = {
    val existsDatabaseStatement = sql"""SELECT 1 FROM pg_roles WHERE rolname='#${roleName}'"""
    db.run(existsDatabaseStatement.as[Int].asTry)
  }

  /**
   * Deletes a role from database
   * @param roleName name of role
   */
  def deleteRole(roleName: String): Future[Try[Vector[Int]]] = {
    val reassignedStatement = sql"""REASSIGN OWNED BY #${roleName} TO postgres"""
    val dropOwnedStatement = sql"""DROP OWNED BY #${roleName}"""
    val dropRoleStatement = sql"""DROP ROLE #${roleName}"""
    db.run(
      reassignedStatement.as[Int].asTry andThen dropOwnedStatement.as[Int].asTry andThen dropRoleStatement.as[Int].asTry
    )
  }

  /**
   * Grants a role access to a database
   * @param roleName name of role
   * @param databaseName name of database
   */
  def grantDatabaseAccess(roleName: String, databaseName: String): Future[Try[Vector[Int]]] = {
    val grantDatabaseAccessStatement = sql"""GRANT ALL PRIVILEGES ON DATABASE #${databaseName} to #${roleName}"""
    db.run(grantDatabaseAccessStatement.as[Int].asTry)
  }
}