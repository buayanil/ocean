package controllers

import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}
import play.api.data.FormError
import play.api.libs.json._

import forms.CredentialsForm
import models.{ErrorBody, ErrorMessage}
import services.UserService


class UserController @Inject()(cc: ControllerComponents, userService: UserService) extends AbstractController(cc) {

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  implicit val errorMessageWrites: OWrites[ErrorMessage] = Json.writes[ErrorMessage]
  implicit val errorBodyWrites: OWrites[ErrorBody] = Json.writes[ErrorBody]

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
