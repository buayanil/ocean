package services

import java.sql.Timestamp
import java.time.Instant
import javax.inject.Inject
import org.postgresql.util.PSQLException
import play.api.Logger

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}
import forms.{CreateInstanceFormData, ExistsInstanceFormData}
import models.{ErrorMessage, Instance, User}
import repositories.InstanceRepository


class InstanceService @Inject()(pgClusterService: PgClusterService, instanceRepository: InstanceRepository) {

  val logger: Logger = Logger(this.getClass)

  def listAll(userId: Long): Either[ErrorMessage, Seq[Instance]] = {
    Await.result(instanceRepository.listAll(userId), Duration.Inf) match {
      case Failure(exception) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INSTANCE_LIST_FAILED,
          ErrorMessage.MESSAGE_INSTANCE_LIST_FAILED,
          developerMessage = exception.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(instances) => Right(instances)
    }
  }

  def getInstance(id: Long, userId: Long): Either[ErrorMessage, Instance] = {
    Await.result(instanceRepository.get(id, userId), Duration.Inf) match {
      case Failure(exception) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INSTANCE_GET_FAILED,
          ErrorMessage.MESSAGE_INSTANCE_GET_FAILED,
          developerMessage = exception.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(instances) if instances.length == 1 => Right(instances.head)
      case Success(instances) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INSTANCE_GET_CONSTRAINT_ERROR,
          ErrorMessage.MESSAGE_INSTANCE_GET_CONSTRAINT_ERROR,
          developerMessage = s"Matches: ${instances.length}"
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  def addInstance(createInstanceFormData: CreateInstanceFormData, user: User): Either[ErrorMessage, Instance] = {
    val localTimestamp = Timestamp.from(Instant.now)
    val localInstance = Instance(0, user.id, createInstanceFormData.name, createInstanceFormData.engine, localTimestamp)
    Await.result(instanceRepository.addInstance(localInstance), Duration.Inf) match {
      case Failure(exception) =>
        val errorMessage = handleAddInstanceThrowable(exception)
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL =>
        pgClusterService.createDatabase(instance.name, user.username) match {
          case Left(errorMessage) =>
            logger.error(errorMessage.toString)
            Left(errorMessage)
          case Right(_) => Right(instance)
        }
      case Success(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
        // TODO: mongodb not implemented yet
        Right(instance)
    }
  }

  private def handleAddInstanceThrowable(exception: Throwable): ErrorMessage = {
    exception match {
      case exception: PSQLException if exception.getMessage.contains("duplicate key value") =>
        ErrorMessage(
          ErrorMessage.CODE_INSTANCE_CREATE_DUPLICATED,
          ErrorMessage.MESSAGE_INSTANCE_CREATE_DUPLICATED,
          developerMessage = exception.getMessage
        )
      case exception: Throwable =>
        ErrorMessage(
          ErrorMessage.CODE_INSTANCE_CREATE_FAILED,
          ErrorMessage.MESSAGE_INSTANCE_CREATE_FAILED,
          developerMessage = exception.getMessage
        )
    }
  }

  def existsInstance(existsFormData: ExistsInstanceFormData): Either[ErrorMessage, Boolean] = {
    Await.result(instanceRepository.exists(existsFormData.name, existsFormData.engine), Duration.Inf) match {
      case Failure(exception) =>
        val errorMessage =  ErrorMessage(
          ErrorMessage.CODE_INSTANCE_EXISTS_FAILED,
          ErrorMessage.MESSAGE_INSTANCE_EXISTS_FAILED,
          developerMessage = exception.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(exists) => Right(exists)
    }
  }

  def deleteInstance(instanceId: Long, userId: Long): Either[ErrorMessage, Int] = {
    Await.result(instanceRepository.deleteInstance(instanceId, userId), Duration.Inf) match {
      case Failure(exception) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INSTANCE_DELETE_FAILED,
          ErrorMessage.MESSAGE_INSTANCE_DELETE_FAILED,
          developerMessage = exception.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(rows) => Right(rows)
    }
  }
}
