package forms

import play.api.data.Form
import play.api.data.Forms.{mapping, _}

import models.Credentials


object CredentialsForm {
  val form: Form[Credentials] = Form(
    mapping(
      "username" -> nonEmptyText,
      "password" -> nonEmptyText,
    )(Credentials.apply)(Credentials.unapply)
  )
}