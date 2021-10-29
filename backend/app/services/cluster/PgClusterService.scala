package services.cluster

import org.postgresql.util.PSQLException
import play.api.{Configuration, Logger}
import java.sql.SQLTransientConnectionException
import javax.inject.Inject
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

import models.ErrorMessage
import repositories.cluster.PgClusterRepository


class PgClusterService @Inject()(configuration: Configuration, pgClusterRepository: PgClusterRepository) {

  val logger: Logger = Logger(this.getClass)

  val LDAP_GROUP_NAME: String = configuration.get[String]("ldap_role")
  val GENERIC_GROUP_NAME: String = configuration.get[String]("generic_role")

  def createDatabase(databaseName: String, ownerName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.createDatabase(databaseName, ownerName), Duration.Inf) match {
      case Success(_) => Right(true)
      case Failure(throwable) =>
        val errorMessage = handleCreateDatabaseThrowable(throwable)
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  private def handleCreateDatabaseThrowable(throwable: Throwable): ErrorMessage = {
    throwable match {
      case exception: PSQLException if exception.getMessage.contains("already exists") =>
        ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_CREATED_DATABASE_EXIST,
          ErrorMessage.MESSAGE_PG_CLUSTER_CREATED_DATABASE_EXIST,
          developerMessage = exception.getMessage
        )
      case exception: SQLTransientConnectionException if exception.getMessage.contains("not available") =>
        ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_CREATED_DATABASE_NOT_AVAILABLE,
          ErrorMessage.MESSAGE_PG_CLUSTER_CREATED_DATABASE_NOT_AVAILABLE,
          developerMessage = exception.getMessage
        )
      case exception =>
        ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_CREATED_DATABASE_UNKNOWN,
          ErrorMessage.MESSAGE_PG_CLUSTER_CREATED_DATABASE_UNKNOWN,
          developerMessage = exception.getMessage
        )
    }
  }

  def createRole(roleName: String, groupName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.createRole(roleName, groupName), Duration.Inf) match {
      case Success(_) => Right(true)
      case Failure(throwable) =>
        val errorMessage = handleCreateRoleThrowable(throwable)
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  def createSecuredRole(roleName: String, groupName: String, password: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.createSecuredRole(roleName, groupName, password), Duration.Inf) match {
      case Success(_) => Right(true)
      case Failure(throwable) =>
        val errorMessage = handleCreateRoleThrowable(throwable)
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  private def handleCreateRoleThrowable(throwable: Throwable): ErrorMessage = {
    throwable match {
      case exception: PSQLException if exception.getMessage.contains("already exists") =>
        ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_CREATED_ROLE_EXIST,
          ErrorMessage.MESSAGE_PG_CLUSTER_CREATED_ROLE_EXIST,
          developerMessage = exception.getMessage
        )
      case exception =>
        ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_CREATED_ROLE_UNKNOWN,
          ErrorMessage.MESSAGE_PG_CLUSTER_CREATED_ROLE_UNKNOWN,
          developerMessage = exception.getMessage
        )
    }
  }

  def deleteDatabase(databaseName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.deleteDatabase(databaseName), Duration.Inf) match {
      case Success(_) => Right(true)
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_DELETE_DATABASE_FAILED,
          ErrorMessage.MESSAGE_PG_CLUSTER_DELETE_DATABASE_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  def deleteRole(roleName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.deleteRole(roleName), Duration.Inf) match {
      case Success(_) => Right(true)
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_DELETED_ROLE_FAILED,
          ErrorMessage.MESSAGE_PG_CLUSTER_DELETE_ROLE_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  def grantDatabaseAccess(roleName: String, databaseName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.grantDatabaseAccess(roleName, databaseName), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_GRANT_FAILED,
          ErrorMessage.MESSAGE_ROLE_GRANT_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(_) => Right(true)
    }
  }

  def removeDatabaseAccess(roleName: String, databaseName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.removeDatabaseAccess(roleName, databaseName), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_ROLE_REVOKE_FAILED,
          ErrorMessage.MESSAGE_ROLE_REVOKE_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(_) => Right(true)
    }
  }
}
