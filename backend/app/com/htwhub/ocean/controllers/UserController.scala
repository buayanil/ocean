package com.htwhub.ocean.controllers

import com.htwhub.ocean.actions.UserAction
import com.htwhub.ocean.actions.UserRequest
import com.htwhub.ocean.managers.UserManager
import com.htwhub.ocean.managers.UserManager.Exceptions.UserManagerException
import javax.inject.Inject
import play.api.i18n.Lang
import play.api.i18n.Messages
import play.api.libs.json.Json
import play.api.mvc.AbstractController
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.ControllerComponents
import play.api.mvc.Result
import play.api.Logger
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class UserController @Inject() (cc: ControllerComponents, userAction: UserAction, userManager: UserManager)(implicit
  executionContext: ExecutionContext
) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit val messages: Messages = messagesApi.preferred(Seq(Lang.defaultLang))

  def getUser: Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    userManager
      .getUserById(request.user.id)
      .map(user => Ok(Json.toJson(user)))
      .recoverWith { case e: UserManagerException => exceptionToResult(e) }
  }

  def getUsers: Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    userManager.getUsers
      .map(users => Ok(Json.toJson(users)))
      .recoverWith { case e: UserManagerException => exceptionToResult(e) }
  }

  def exceptionToResult(e: UserManagerException): Future[Result] = e match {
    case _: UserManager.Exceptions.NotFound      => Future.successful(NotFound(e.getMessage))
    case _: UserManager.Exceptions.AccessDenied  => Future.successful(Forbidden(e.getMessage))
    case _: UserManager.Exceptions.InternalError => Future.successful(BadRequest(e.getMessage))
  }
}
