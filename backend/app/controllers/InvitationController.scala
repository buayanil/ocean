package controllers


import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.api.data.FormError
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.Logger

import actions.{UserAction, UserRequest}
import forms.CreateInvitationForm
import models.{ErrorResponse, InvitationDeletedResponse}
import services.InvitationManagerService


class InvitationController @Inject()(cc: ControllerComponents, userAction: UserAction, invitationManagerService: InvitationManagerService) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  def getAllForInstance(instanceId: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    invitationManagerService.getAllForInstance(instanceId, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(error)))
      case Right(invitations) => Ok(Json.toJson(invitations))
    }
  }

  def addInvitation(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    CreateInvitationForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      createInvitationFormData => {
        invitationManagerService.addInvitation(createInvitationFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(error)))
          case Right(invitation) => Ok(Json.toJson(invitation))
        }
      }
    )
  }

  def deleteInvitation(id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    invitationManagerService.deleteInvitation(id, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(error)))
      case Right(rows) => Ok(Json.toJson((InvitationDeletedResponse(rows))))
    }
  }
}