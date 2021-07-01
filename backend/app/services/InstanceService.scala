package services

import javax.inject.Inject
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

import models.ErrorMessage
import repositories.InstanceRepository


class InstanceService @Inject()(instanceRepository: InstanceRepository) {

  def listAll(userId: Long): Either[ErrorMessage, Seq[models.Instance]] = {
    Await.result(instanceRepository.listAll(userId), Duration.Inf) match {
      case Failure(exception) =>
        Left(ErrorMessage(ErrorMessage.CODE_INSTANCE_LIST_FAILED, ErrorMessage.MESSAGE_INSTANCE_LIST_FAILED, developerMessage = exception.getMessage))
      case Success(instances) => Right(instances)
    }
  }

}
