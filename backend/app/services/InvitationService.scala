package services

import forms.CreateInvitationFormData
import models.{ErrorMessage, Invitation, User}
import org.postgresql.util.PSQLException
import play.api.Logger
import repositories.InvitationRepository

import java.sql.Timestamp
import java.time.Instant
import javax.inject.Inject
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

class InvitationService @Inject()(invitationRepository: InvitationRepository) {

  val logger: Logger = Logger(this.getClass)

  def getAllForInstance(instanceId: Long): Either[ErrorMessage, Seq[Invitation]] = {
    Await.result(invitationRepository.getAllForInstance(instanceId), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INVITATION_LIST_FAILED,
          ErrorMessage.MESSAGE_INVITATION_LIST_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(invitations) => Right(invitations)
    }
  }

  def getInvitation(instanceId: Long): Either[ErrorMessage, Invitation] = {
    Await.result(invitationRepository.getInvitation(instanceId), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INVITATION_GET_FAILED,
          ErrorMessage.MESSAGE_INVITATION_GET_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(invitations) if invitations.nonEmpty => Right(invitations.head)
      case _ =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INVITATION_GET_FAILED,
          ErrorMessage.MESSAGE_INVITATION_GET_FAILED,
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
    }
  }

  def addInvitation(createInvitationFormData: CreateInvitationFormData): Either[ErrorMessage, Invitation] = {
    val localTimestamp = Timestamp.from(Instant.now)
    val localInvitation = Invitation(0, createInvitationFormData.instanceId, createInvitationFormData.instanceId, localTimestamp)
    Await.result(invitationRepository.addInvitation(localInvitation), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = handleAddInvitationThrowable(throwable)
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(invitation) => Right(invitation)
    }
  }

  private def handleAddInvitationThrowable(throwable: Throwable): ErrorMessage = {
    throwable match {
      case exception: PSQLException if exception.getMessage.contains("duplicate key value") =>
        ErrorMessage(
          ErrorMessage.CODE_INVITATION_CREATE_DUPLICATED,
          ErrorMessage.MESSAGE_INVITATION_CREATE_DUPLICATED,
          developerMessage = exception.getMessage
        )
      case exception: Throwable =>
        ErrorMessage(
          ErrorMessage.CODE_INVITATION_CREATE_FAILED,
          ErrorMessage.MESSAGE_INVITATION_CREATE_FAILED,
          developerMessage = exception.getMessage
        )
    }
  }

  def deleteInvitation(invitationId: Long): Either[ErrorMessage, Int] = {
    Await.result(invitationRepository.deleteInvitation(invitationId), Duration.Inf) match {
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INVITATION_DELETE_FAILED,
          ErrorMessage.MESSAGE_INVITATION_DELETE_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.error(errorMessage.toString)
        Left(errorMessage)
      case Success(rows) => Right(rows)
    }
  }

  def deleteDatabaseInvitations(instanceId: Long): Either[ErrorMessage, Int] = {
    Await.result(invitationRepository.deleteDatabaseInvitations(instanceId), Duration.Inf) match {
      case Success(rows) => Right(rows)
      case Failure(throwable) =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_INVITATION_DELETE_FAILED,
          ErrorMessage.MESSAGE_INVITATION_DELETE_FAILED,
          developerMessage = throwable.getMessage
        )
        logger.warn(errorMessage.toString)
        Left(errorMessage)
    }
  }
}
