package forms

import models.Instance
import play.api.data.Form
import play.api.data.Forms.{mapping, nonEmptyText}

case class CreateInstanceFormData(name: String, engine: String)

object CreateInstanceForm {

  val form: Form[CreateInstanceFormData] = Form(
    mapping(
      "name" ->
        nonEmptyText
          .verifying("Name must begin with a letter (a-z). Subsequent characters in a name can be letters, digits (0-9), or underscores.", name => name.matches("[a-z][a-z0-9_]*$")),
      "engine" ->
        nonEmptyText.verifying("Invalid engine type.", engine => Instance.ENGINE_ALLOWED.contains(engine)),
    )(CreateInstanceFormData.apply)(CreateInstanceFormData.unapply)
  )
}


case class ExistsInstanceFormData(name: String, engine: String)

object ExistsInstanceForm {

  val form: Form[ExistsInstanceFormData] = Form(
    mapping(
      "name" -> nonEmptyText,
      "engine" -> nonEmptyText.verifying("Invalid engine type.", engine => Instance.ENGINE_ALLOWED.contains(engine)),
    )(ExistsInstanceFormData.apply)(ExistsInstanceFormData.unapply)
  )
}
