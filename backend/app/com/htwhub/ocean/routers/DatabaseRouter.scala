package com.htwhub.ocean.routers

import com.htwhub.ocean.controllers.DatabaseController
import javax.inject.Inject
import play.api.routing.sird._
import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter

class DatabaseRouter @Inject() (databaseController: DatabaseController) extends SimpleRouter {

  override def routes: Routes = { case GET(p"/") =>
    databaseController.getDatabases
  }
}
