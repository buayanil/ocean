package com.htwhub.ocean.controllers

import com.htwhub.ocean.actions.UserAction
import com.htwhub.ocean.managers.DatabaseManager
import javax.inject.Inject
import play.api.i18n.Lang
import play.api.i18n.Messages
import play.api.mvc.AbstractController
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.ControllerComponents
import play.api.mvc.Request
import play.api.Logger
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class DatabaseController @Inject() (cc: ControllerComponents, userAction: UserAction, databaseManager: DatabaseManager)(
  implicit ec: ExecutionContext
) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit val messages: Messages = messagesApi.preferred(Seq(Lang.defaultLang))

  def getDatabases: Action[AnyContent] = userAction.async { implicit request: Request[AnyContent] =>
    Future {
      Ok("works")
    }
  }

}
