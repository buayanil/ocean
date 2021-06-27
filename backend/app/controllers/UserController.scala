package controllers

import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}
import play.api.data.FormError
import play.api.libs.json._

import actions.{UserAction, UserRequest}
import forms.CredentialsForm
import models.{ErrorBody, ErrorMessage, User}
import services.UserService


class UserController @Inject()(cc: ControllerComponents, userService: UserService, userAction: UserAction) extends AbstractController(cc) {

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  implicit val userWrites: OWrites[User] = Json.writes[User]
  implicit val errorMessageWrites: OWrites[ErrorMessage] = Json.writes[ErrorMessage]
  implicit val errorBodyWrites: OWrites[ErrorBody] = Json.writes[ErrorBody]

  def index: Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    Ok(Json.toJson(request.user))
  }

  def login: Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    CredentialsForm.form.bindFromRequest.fold(
      formWithErrors => {
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      formData => {
        userService.login(formData.username, formData.password) match {
          case Left(value) => BadRequest(Json.toJson(ErrorBody(value)))
          case Right(token) => Ok(token)
        }
      }
    )
  }

}
