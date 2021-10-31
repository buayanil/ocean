package forms

import models.Credentials
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Forms.mapping

object CredentialsForm {
  val form: Form[Credentials] = Form(
    mapping(
      "username" -> nonEmptyText,
      "password" -> nonEmptyText,
    )(Credentials.apply)(Credentials.unapply)
  )
}
