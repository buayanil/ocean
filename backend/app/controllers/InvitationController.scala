package controllers

import actions.UserAction
import actions.UserRequest
import forms.CreateInvitationForm
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiParam
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import javax.inject.Inject
import models.ErrorResponse
import models.Invitation
import models.InvitationDeletedResponse
import models.Role
import play.api.data.FormError
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.json.Writes
import play.api.mvc.AbstractController
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.ControllerComponents
import play.api.Logger
import services.InvitationManagerService

@Api(value = "Invitations")
class InvitationController @Inject() (
  cc: ControllerComponents,
  userAction: UserAction,
  invitationManagerService: InvitationManagerService
) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  @ApiOperation(
    value = "Get Database Invitations",
    notes = "Get invitations for a single database.",
    httpMethod = "GET",
    response = classOf[Invitation],
    responseContainer = "List"
  )
  @ApiResponses(
    value = Array(
      new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
      new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])
    )
  )
  def getInvitationsByDatabaseId(
    @ApiParam(value = "ID of database that needs to be fetched", required = true) instanceId: Long
  ): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    invitationManagerService.getAllForInstance(instanceId, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(error)))
      case Right(invitations) => Ok(Json.toJson(invitations))
    }
  }

  @ApiOperation(
    value = "Create Invitation",
    notes = "Create a single invitation.",
    httpMethod = "POST",
    response = classOf[Invitation]
  )
  @ApiResponses(
    value = Array(
      new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
      new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])
    )
  )
  def addInvitation(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    CreateInvitationForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      createInvitationFormData =>
        invitationManagerService.addInvitation(createInvitationFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(error)))
          case Right(invitation) => Ok(Json.toJson(invitation))
        }
    )
  }

  @ApiOperation(
    value = "Delete Invitation",
    notes = "Delete a single invitation.",
    httpMethod = "DELETE",
    response = classOf[InvitationDeletedResponse]
  )
  @ApiResponses(
    value = Array(
      new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
      new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])
    )
  )
  def deleteInvitation(id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    invitationManagerService.deleteInvitation(id, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(error)))
      case Right(rows) => Ok(Json.toJson((InvitationDeletedResponse(rows))))
    }
  }
}
