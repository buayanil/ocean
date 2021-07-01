package controllers

import play.api.libs.json.{JsValue, Json, Writes}
import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.api.data.FormError

import actions.{UserAction, UserRequest}
import models.{CreateInstanceForm, ErrorBody}
import services.InstanceService


class InstanceController @Inject()(cc: ControllerComponents, userAction: UserAction, instanceService: InstanceService) extends AbstractController(cc) {

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  def listAll(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    instanceService.listAll(request.user.id) match {
      case Left(error) => BadRequest(Json.toJson(ErrorBody(List(error))))
      case Right(instances) => Ok(Json.toJson(instances))
    }
  }

  def addInstance(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    CreateInstanceForm.form.bindFromRequest.fold(
      formWithErrors => {
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      createInstanceFormData => {
        instanceService.addInstance(createInstanceFormData, request.user.id) match {
          case Left(error) => BadRequest(Json.toJson(ErrorBody(List(error))))
          case Right(instance) => Ok(Json.toJson(instance))
        }
      }
    )
  }
}