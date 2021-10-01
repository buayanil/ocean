package controllers

import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.api.data.FormError
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.Logger

import actions.{UserAction, UserRequest}
import forms.{CreateInstanceForm, ExistsInstanceForm, ExistsInstanceFormData}
import models.{ErrorResponse, ExistsInstanceResponse, InstanceDeletedResponse}
import services.{DatabaseManagerService, InstanceService}


class InstanceController @Inject()(cc: ControllerComponents, userAction: UserAction, instanceService: InstanceService, databaseManagerService: DatabaseManagerService) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  def listAll(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    instanceService.listAll(request.user.id) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(List(error))))
      case Right(instances) => Ok(Json.toJson(instances))
    }
  }

  def get(id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    instanceService.getInstance(id, request.user.id) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(List(error))))
      case Right(instance) => Ok(Json.toJson(instance))
    }
  }


  def addInstance(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    CreateInstanceForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      createInstanceFormData => {
        instanceService.addInstance(createInstanceFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(List(error))))
          case Right(instance) => Ok(Json.toJson(instance))
        }
      }
    )
  }

  def existsInstance(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
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

  def deleteInstance(id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    databaseManagerService.deleteDatabase(id, request.user) match {
      case Left(errors) =>
        logger.error(errors.toString)
        BadRequest(Json.toJson(ErrorResponse(errors)))
      case Right(rows) => Ok(Json.toJson((InstanceDeletedResponse(rows))))
    }
  }
}