package controllers

import actions.UserAction
import actions.UserRequest
import javax.inject._
import play.api.mvc._

@Singleton
class HomeController @Inject() (cc: ControllerComponents, userAction: UserAction) extends AbstractController(cc) {

  def index: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    Ok("Ping")
  }

}
