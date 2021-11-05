package com.htwhub.ocean.engines

import javax.inject.Inject
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class PostgreSQLEngine @Inject() ()(implicit ec: ExecutionContext) {

  import slick.jdbc.PostgresProfile.api._

  val db = Database.forConfig("pg_cluster")

  def createDatabase(databaseName: String): Future[Vector[Int]] = {
    val createDatabaseStatement = sql"""CREATE DATABASE #${databaseName}"""
    db.run(createDatabaseStatement.as[Int])
  }

  def deleteDatabase(databaseName: String): Future[Vector[Int]] = {
    val deleteDatabaseStatement = sql"""DROP DATABASE IF EXISTS #${databaseName}"""
    db.run(deleteDatabaseStatement.as[Int])
  }

  def createGroup(groupName: String): Future[Vector[Int]] = {
    val createGroupStatement = sql"""CREATE ROLE #${groupName} WITH NOSUPERUSER"""
    db.run(createGroupStatement.as[Int])
  }

  def createRoleInGroup(roleName: String, groupName: String): Future[Vector[Int]] = {
    val createRoleInGroupStatement =
      sql"""CREATE ROLE #${roleName} WITH NOSUPERUSER LOGIN CONNECTION LIMIT 500 IN ROLE #${groupName}"""
    db.run(createRoleInGroupStatement.as[Int])
  }

  def createRoleInGroupWithPassword(roleName: String, groupName: String, password: String): Future[Vector[Int]] = {
    val createRoleInGroupWithPasswordStatement =
      sql"""CREATE ROLE #${roleName} WITH NOSUPERUSER LOGIN CONNECTION LIMIT 500 IN ROLE #${groupName} PASSWORD '#${password}'"""
    db.run(createRoleInGroupWithPasswordStatement.as[Int])
  }

  def dropRole(roleName: String): Future[Vector[Int]] = {
    val dropRoleStatement = sql"""REASSIGN OWNED BY #${roleName} TO postgres"""
    db.run(dropRoleStatement.as[Int])
  }

  def existsRole(roleName: String): Future[Vector[Int]] = {
    val existsDatabaseStatement = sql"""SELECT 1 FROM pg_roles WHERE rolname='#${roleName}'"""
    db.run(existsDatabaseStatement.as[Int])
  }

  def grantDatabaseAccess(databaseName: String, roleName: String): Future[Vector[Int]] = {
    val grantDatabaseAccessStatement = sql"""GRANT ALL PRIVILEGES ON DATABASE #${databaseName} to #${roleName}"""
    db.run(grantDatabaseAccessStatement.as[Int])
  }

  def revokePublicAccess(databaseName: String): Future[Vector[Int]] = {
    val revokePublicAccessStatement = sql"""REVOKE ALL ON DATABASE #${databaseName} FROM PUBLIC"""
    db.run(revokePublicAccessStatement.as[Int])
  }

  def revokeDatabaseAccess(roleName: String, databaseName: String): Future[Vector[Int]] = {
    val revokeDatabaseAccessStatement = sql"""REVOKE ALL PRIVILEGES ON DATABASE #${databaseName} FROM #${roleName}"""
    db.run(revokeDatabaseAccessStatement.as[Int])
  }

  def dropOwnedBy(roleName: String): Future[Vector[Int]] = {
    val dropOwnedByStatement = sql"""DROP OWNED BY #${roleName}"""
    db.run(dropOwnedByStatement.as[Int])
  }

  def reassignedOwnedBy(roleName: String): Future[Vector[Int]] = {
    val reassignedOwnedByStatement = sql"""REASSIGN OWNED BY #${roleName} TO postgres"""
    db.run(reassignedOwnedByStatement.as[Int])
  }
}
