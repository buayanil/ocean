package controllers

import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.api.data.FormError
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.Logger
import actions.{UserAction, UserRequest}
import forms.{CreateRoleForm, RoleExistsForm}
import io.swagger.annotations.{Api, ApiOperation, ApiParam, ApiResponse, ApiResponses}
import models.{ErrorResponse, ExistsRoleResponse, Role, RoleDeletedResponse}
import services.{RoleManagerService, RoleService}


@Api(value = "Roles")
class RoleController @Inject()(cc: ControllerComponents,
                               userAction: UserAction,
                               roleService: RoleService,
                               roleManagerService: RoleManagerService) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  @ApiOperation(
    value = "Get Database Roles",
    notes = "Get roles for a single database.",
    httpMethod = "GET",
    response = classOf[Role],
    responseContainer = "List"
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def getRolesByDatabaseId(@ApiParam(value = "ID of database that needs to be fetched", required = true) instanceId: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    roleService.listInstanceRoles(instanceId, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(List(error))))
      case Right(roles) => Ok(Json.toJson(roles))
    }
  }

  @ApiOperation(
    value = "Create Role",
    notes = "Create a single role.",
    httpMethod = "POST",
    response = classOf[Role]
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def addRole(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    CreateRoleForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      createRoleFormData => {
        roleManagerService.addRole(createRoleFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(error)))
          case Right(instance) => Ok(Json.toJson(instance))
        }
      }
    )
  }

  @ApiOperation(
    value = "Check for Role",
    notes = "Check to see if a role exists.",
    httpMethod = "POST",
    response = classOf[ExistsRoleResponse]
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def existsRole(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    RoleExistsForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      roleExistsFormData => {
        roleService.existsRole(roleExistsFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(List(error))))
          case Right(exists) =>
            Ok(Json.toJson(ExistsRoleResponse(exists)))
        }
      }
    )
  }

  @ApiOperation(
    value = "Delete Role",
    notes = "Delete a single role.",
    httpMethod = "DELETE",
    response = classOf[RoleDeletedResponse]
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def deleteRole(id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    roleManagerService.deleteRole(id, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(error)))
      case Right(rows) => Ok(Json.toJson((RoleDeletedResponse(rows))))
    }
  }
}