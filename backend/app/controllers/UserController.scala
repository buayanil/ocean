package controllers

import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}
import play.api.data.FormError
import play.api.libs.json._
import javax.inject.Inject

import forms.CredentialsForm
import services.UserService


class UserController @Inject()(cc: ControllerComponents, userService: UserService) extends AbstractController(cc) {

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  def login: Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    CredentialsForm.form.bindFromRequest.fold(
      formWithErrors => {
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      formData => {
        // TODO: userService.login(formData.username, formData.password)
        Ok("")
      }
    )
  }

}
