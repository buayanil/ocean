package services

import javax.inject.Inject
import play.api.Logger

import models.{ErrorMessage, Invitation, User}
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
      case Left(throwable) => Left(List(throwable))
      case Right(instance) => userService.getUserById(createInvitationFormData.userId) match {
        case Left(throwable) => Left(List(throwable))
        case Right(invitedUser) => invitationService.addInvitation(createInvitationFormData) match {
          case Left(throwable) => Left(List(throwable))
          case Right(invitation) => pgClusterService.grantDatabaseAccess(invitedUser.username, instance.name) match {
            case Left(throwable) => Left(List(throwable))
            case Right(value) => Right(invitation)
          }
        }
      }
    }
  }

  def deleteInvitation(invitationId: Long, user: User): Either[List[ErrorMessage], Int] = {
    invitationService.getInvitation(invitationId) match {
      case Left(throwable) => Left(List(throwable))
      case Right(invitation) => instanceService.getInstance(invitation.instanceId, user.id) match {
        case Left(throwable) => Left(List(throwable))
        case Right(instance) => invitationService.deleteInvitation(invitationId) match {
          case Left(throwable) => Left(List(throwable))
          case Right(rows) => userService.getUserById(invitation.userId) match {
            case Left(throwable) => Left(List(throwable))
            case Right(revokeUser) => pgClusterService.removeDatabaseAccess(revokeUser.username, instance.name) match {
              case Left(throwable) => Left(List(throwable))
              case Right(value) => Right(rows)
            }
          }
        }
      }
    }
  }
}
