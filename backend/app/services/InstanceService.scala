package services

import java.sql.Timestamp
import java.time.Instant
import javax.inject.Inject
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}
import org.postgresql.util.PSQLException

import models.{CreateInstanceFormData, ErrorMessage, Instance}
import repositories.InstanceRepository


class InstanceService @Inject()(instanceRepository: InstanceRepository) {

  def listAll(userId: Long): Either[ErrorMessage, Seq[Instance]] = {
    Await.result(instanceRepository.listAll(userId), Duration.Inf) match {
      case Failure(exception) =>
        Left(ErrorMessage(ErrorMessage.CODE_INSTANCE_LIST_FAILED, ErrorMessage.MESSAGE_INSTANCE_LIST_FAILED, developerMessage = exception.getMessage))
      case Success(instances) => Right(instances)
    }
  }

  def getInstance(id: Long, userId: Long): Either[ErrorMessage, Instance] = {
    Await.result(instanceRepository.get(id, userId), Duration.Inf) match {
      case Failure(exception) =>
        Left(ErrorMessage(ErrorMessage.CODE_INSTANCE_GET_FAILED, ErrorMessage.MESSAGE_INSTANCE_GET_FAILED, developerMessage = exception.getMessage))
      case Success(instances) if instances.length == 1 => Right(instances.head)
      case Success(instances) =>
        Left(ErrorMessage(ErrorMessage.CODE_INSTANCE_GET_CONSTRAINT_ERROR, ErrorMessage.MESSAGE_INSTANCE_GET_CONSTRAINT_ERROR, developerMessage = s"Matches: ${instances.length}"))
    }
  }

  def addInstance(createInstanceFormData: CreateInstanceFormData, userId: Long): Either[ErrorMessage, Instance] = {
    val localTimestamp = Timestamp.from(Instant.now)
    val localInstance = Instance(0, userId, createInstanceFormData.name, createInstanceFormData.engine, localTimestamp)
    Await.result(instanceRepository.addInstance(localInstance), Duration.Inf) match {
      case Failure(exception) =>
        Left(getErrorMessageFor(exception))
      case Success(instance) => Right(instance)
    }
  }

  private def getErrorMessageFor(exception: Throwable): ErrorMessage = {
    exception match {
      case exception: PSQLException if exception.getMessage.contains("duplicate key value") =>
        ErrorMessage(ErrorMessage.CODE_INSTANCE_CREATE_DUPLICATED, ErrorMessage.MESSAGE_INSTANCE_CREATE_DUPLICATED, developerMessage = exception.getMessage)
      case exception: Throwable =>
        ErrorMessage(ErrorMessage.CODE_INSTANCE_CREATE_FAILED, ErrorMessage.MESSAGE_INSTANCE_CREATE_FAILED, developerMessage = exception.getMessage)
    }
  }

  def existsInstance(createInstanceFormData: CreateInstanceFormData): Either[ErrorMessage, Boolean] = {
    Await.result(instanceRepository.exists(createInstanceFormData.name, createInstanceFormData.engine), Duration.Inf) match {
      case Failure(exception) =>
        Left(ErrorMessage(ErrorMessage.CODE_INSTANCE_EXISTS_FAILED, ErrorMessage.MESSAGE_INSTANCE_EXISTS_FAILED, developerMessage = exception.getMessage))
      case Success(exists) => Right(exists)
    }
  }

  def deleteInstance(instanceId: Long, userId: Long): Either[ErrorMessage, Int] = {
    Await.result(instanceRepository.deleteInstance(instanceId, userId), Duration.Inf) match {
      case Failure(exception) =>
        Left(ErrorMessage(ErrorMessage.CODE_INSTANCE_DELETE_FAILED, ErrorMessage.MESSAGE_INSTANCE_DELETE_FAILED, developerMessage = exception.getMessage))
      case Success(rows) => Right(rows)
    }
  }

}
