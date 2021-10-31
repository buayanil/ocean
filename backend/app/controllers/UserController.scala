package controllers

import actions.UserAction
import actions.UserRequest
import forms.CredentialsForm
import forms.UserSearchForm
import javax.inject.Inject
import models.ErrorResponse
import models.LoginSuccessResponse
import play.api.data.FormError
import play.api.libs.json._
import play.api.mvc.AbstractController
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.ControllerComponents
import play.api.mvc.Request
import play.api.Logger
import services.UserService

class UserController @Inject() (cc: ControllerComponents, userService: UserService, userAction: UserAction)
    extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  def index: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    Ok(Json.toJson(request.user))
  }

  def login: Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    CredentialsForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      formData =>
        userService.login(formData.username, formData.password) match {
          case Left(error) =>
            logger.warn(error.toString)
            BadRequest(Json.toJson(ErrorResponse(error)))
          case Right(token) => Ok(Json.toJson(LoginSuccessResponse(token)))
        }
    )
  }

  def getAll: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    userService.getAll match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(List(error))))
      case Right(users) =>
        Ok(Json.toJson(users))
    }
  }

  def getAllForPattern: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    UserSearchForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      userSearchFormData =>
        userService.getAllForPattern(userSearchFormData.username) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(List(error))))
          case Right(users) =>
            Ok(Json.toJson(users))
        }
    )
  }
}
