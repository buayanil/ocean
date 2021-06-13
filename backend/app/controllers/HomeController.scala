package controllers

import play.api.mvc._
import javax.inject._

import services.TokenService


@Singleton
class HomeController @Inject()(cc: ControllerComponents, tokenService: TokenService) extends AbstractController(cc) {

  def index: Action[AnyContent] = Action {
    val a = tokenService.encode("s0558151")
    print(a)
    Ok("Ok")
  }

}
