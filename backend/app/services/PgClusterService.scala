package services

import javax.inject.Inject
import org.postgresql.util.PSQLException
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

import models.ErrorMessage
import repositories.PgClusterRepository


class PgClusterService @Inject()(pgClusterRepository: PgClusterRepository) {

  def createDatabase(databaseName: String, ownerName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.createDatabase(databaseName, ownerName), Duration.Inf) match {
      case Success(_) => Right(true)
      case Failure(throwable) => Left(handleCreateDatabaseThrowable(throwable))
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
      case exception =>
        ErrorMessage(
          ErrorMessage.CODE_PG_CLUSTER_CREATED_DATABASE_UNKNOWN,
          ErrorMessage.MESSAGE_PG_CLUSTER_CREATED_DATABASE_UNKNOWN,
          developerMessage = exception.getMessage
        )
    }
  }

  def createRole(roleName: String): Either[ErrorMessage, Boolean] = {
    Await.result(pgClusterRepository.createRole(roleName), Duration.Inf) match {
      case Success(_) => Right(true)
      case Failure(throwable) => Left(handleCreateRoleThrowable(throwable))
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

}
