package services

import javax.inject.Inject
import play.api.Logger
import models.{ErrorMessage, Instance, Invitation, User}
import forms.CreateInvitationFormData
import services.cluster.PgClusterService


class InvitationManagerService @Inject()(pgClusterService: PgClusterService, invitationService: InvitationService, instanceService: InstanceService, userService: UserService) {

  val logger: Logger = Logger(this.getClass)

  def getAllForInstance(instanceId: Long, user: User): Either[List[ErrorMessage], Seq[Invitation]] = {
    instanceService.getInstance(instanceId, user.id) match {
      case Left(throwable) => Left(List(throwable))
      case Right(value) => invitationService.getAllForInstance(instanceId) match {
        case Left(throwable) => Left(List(throwable))
        case Right(invitations) => Right(invitations)
      }
    }
  }

  def addInvitation(createInvitationFormData: CreateInvitationFormData, user: User): Either[List[ErrorMessage], Invitation] = {
    instanceService.getInstance(createInvitationFormData.instanceId, user.id) match {
      case Left(errorMessage) => Left(List(errorMessage))
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
        val errorMessage: ErrorMessage = ErrorMessage(
          ErrorMessage.CODE_INVITATION_NOT_SUPPORTED,
          ErrorMessage.MESSAGE_INVITATION_NOT_SUPPORTED
        )
        logger.warn(errorMessage.toString)
        Left(List(errorMessage))
      case Right(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL => userService.getUserById(createInvitationFormData.userId) match {
        case Left(errorMessage) => Left(List(errorMessage))
        case Right(invitedUser) => invitationService.addInvitation(createInvitationFormData) match {
          case Left(errorMessage) => Left(List(errorMessage))
          case Right(invitation) => pgClusterService.grantDatabaseAccess(invitedUser.username, instance.name) match {
            case Left(errorMessage) => Left(List(errorMessage))
            case Right(value) => Right(invitation)
          }
        }
      }
    }
  }

  def deleteInvitation(invitationId: Long, user: User): Either[List[ErrorMessage], Int] = {
    invitationService.getInvitation(invitationId) match {
      case Left(errorMessage) => Left(List(errorMessage))
      case Right(invitation) => instanceService.getInstance(invitation.instanceId, user.id) match {
        case Left(errorMessage) => Left(List(errorMessage))
        case Right(instance) if instance.engine == Instance.ENGINE_TYPE_MONGODB =>
          val errorMessage: ErrorMessage = ErrorMessage(
            ErrorMessage.CODE_INVITATION_NOT_SUPPORTED,
            ErrorMessage.MESSAGE_INVITATION_NOT_SUPPORTED
          )
          logger.warn(errorMessage.toString)
          Left(List(errorMessage))
        case Right(instance) if instance.engine == Instance.ENGINE_TYPE_POSTGRESQL => invitationService.deleteInvitation(invitationId) match {
          case Left(errorMessage) => Left(List(errorMessage))
          case Right(rows) => userService.getUserById(invitation.userId) match {
            case Left(errorMessage) => Left(List(errorMessage))
            case Right(revokeUser) => pgClusterService.removeDatabaseAccess(revokeUser.username, instance.name) match {
              case Left(errorMessage) => Left(List(errorMessage))
              case Right(value) => Right(rows)
            }
          }
        }
      }
    }
  }
}
