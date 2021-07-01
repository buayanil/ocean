package controllers

import play.api.libs.json.Json
import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}

import actions.{UserAction, UserRequest}
import models.ErrorBody
import services.InstanceService


class InstanceController @Inject()(cc: ControllerComponents, userAction: UserAction, instanceService: InstanceService) extends AbstractController(cc) {

  def index: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    instanceService.listAll(request.user.id) match {
      case Left(error) => BadRequest(Json.toJson(ErrorBody(List(error))))
      case Right(instances) => Ok(Json.toJson(instances))
    }
  }

}