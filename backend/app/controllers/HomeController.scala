package controllers

import play.api.mvc._
import javax.inject._

import actions.{UserAction, UserRequest}


@Singleton
class HomeController @Inject()(cc: ControllerComponents, userAction: UserAction) extends AbstractController(cc) {

  def index: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    Ok("Ok")
  }

}
