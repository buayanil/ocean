package controllers

import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.api.data.FormError
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.Logger
import actions.{UserAction, UserRequest}
import forms.{CreateInstanceForm, ExistsInstanceForm}
import io.swagger.annotations._
import models.{ErrorResponse, ExistsInstanceResponse, Instance, InstanceDeletedResponse}
import services.{DatabaseManagerService, InstanceService}


@Api(value = "Databases")
class InstanceController @Inject()(cc: ControllerComponents, userAction: UserAction, instanceService: InstanceService, databaseManagerService: DatabaseManagerService) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  @ApiOperation(
    value = "Get Databases",
    notes = "Get information for multiple databases.",
    httpMethod = "GET",
    response = classOf[Instance],
    responseContainer = "List"
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def getDatabases: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    instanceService.listAll(request.user.id) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(List(error))))
      case Right(instances) => Ok(Json.toJson(instances))
    }
  }

  @ApiOperation(
    value = "Get Database",
    notes = "Get information for a single database identified by their unique ID.",
    httpMethod = "GET",
    response = classOf[Instance]
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def getDatabaseById(@ApiParam(value = "ID of database that needs to be fetched", required = true) id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    instanceService.getInstance(id, request.user.id) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(List(error))))
      case Right(instance) => Ok(Json.toJson(instance))
    }
  }

  @ApiOperation(
    value = "Create Database",
    notes = "Create a single database.",
    httpMethod = "POST",
    response = classOf[Instance]
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def addDatabase(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    CreateInstanceForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      createInstanceFormData => {
        databaseManagerService.addInstance(createInstanceFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(error)))
          case Right(instance) => Ok(Json.toJson(instance))
        }
      }
    )
  }

  @ApiOperation(
    value = "Check for Database",
    notes = "Check to see if a database exists.",
    httpMethod = "POST",
    response = classOf[ExistsInstanceResponse]
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def existsDatabase(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    ExistsInstanceForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      existsInstanceFormData => {
        instanceService.existsInstance(existsInstanceFormData) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(List(error))))
          case Right(exists) => Ok(Json.toJson(ExistsInstanceResponse(exists)))
        }
      }
    )
  }

  @ApiOperation(
    value = "Delete Database",
    notes = "Delete a single database.",
    httpMethod = "DELETE",
    response = classOf[InstanceDeletedResponse]
  )
  @ApiResponses(value = Array(
    new ApiResponse(code = 400, message = "Invalid ID supplied", response = classOf[ErrorResponse]),
    new ApiResponse(code = 403, message = "Forbidden", response = classOf[ErrorResponse])))
  def deleteDatabase(id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    databaseManagerService.deleteDatabase(id, request.user) match {
      case Left(errors) =>
        logger.error(errors.toString)
        BadRequest(Json.toJson(ErrorResponse(errors)))
      case Right(rows) => Ok(Json.toJson((InstanceDeletedResponse(rows))))
    }
  }
}