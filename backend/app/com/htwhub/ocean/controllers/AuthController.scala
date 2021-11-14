package com.htwhub.ocean.controllers

import com.htwhub.ocean.managers.AuthManager
import com.htwhub.ocean.managers.AuthManager.Exceptions.AuthManagerException
import com.htwhub.ocean.serializers.auth.SignInRequest
import com.htwhub.ocean.serializers.auth.SignInSerializer
import javax.inject.Inject
import play.api.data.Form
import play.api.i18n.Lang
import play.api.i18n.Messages
import play.api.libs.json.Json
import play.api.mvc.AbstractController
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.ControllerComponents
import play.api.mvc.Request
import play.api.mvc.Result
import play.api.mvc.Results.BadRequest
import play.api.mvc.Results.Forbidden
import play.api.Logger
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class AuthController @Inject() (cc: ControllerComponents, authManager: AuthManager)(implicit
  ec: ExecutionContext
) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit val messages: Messages = messagesApi.preferred(Seq(Lang.defaultLang))

  def signIn: Action[AnyContent] = Action.async { implicit request: Request[AnyContent] =>
    processSignInRequest()
  }

  private def processSignInRequest[A]()(implicit request: Request[A]): Future[Result] = {
    def failure(badForm: Form[SignInRequest]): Future[Result] =
      Future.successful(BadRequest(badForm.errorsAsJson))
    def success(signInRequest: SignInRequest): Future[Result] =
      authManager
        .signIn(signInRequest)
        .map(response => Ok(Json.toJson(response)))
        .recoverWith { case e: AuthManagerException => AuthController.exceptionToResult(e) }
    SignInSerializer.constraints.bindFromRequest().fold(failure, success)
  }

}

object AuthController {
  def exceptionToResult(e: AuthManagerException): Future[Result] = e match {
    case _: AuthManager.Exceptions.AccessDenied  => Future.successful(Forbidden(e.getMessage))
    case _: AuthManager.Exceptions.InternalError => Future.successful(BadRequest(e.getMessage))
  }
}
