package com.htwhub.ocean.routers

import com.htwhub.ocean.controllers.AuthController
import javax.inject.Inject
import play.api.routing.sird._
import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter

class AuthRouter @Inject() (authController: AuthController) extends SimpleRouter {

  override def routes: Routes = { case POST(p"/signin") =>
    authController.signIn
  }
}
