package controllers

import play.api.mvc._
import javax.inject._

import repositories.UserRepository


@Singleton
class HomeController @Inject()(cc: ControllerComponents, userRepository: UserRepository) extends AbstractController(cc) {

  def index: Action[AnyContent] = Action {
    Ok("Ok")
  }

}
