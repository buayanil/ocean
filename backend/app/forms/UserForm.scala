package forms

import play.api.data.Form
import play.api.data.Forms._

case class UserSearchFormData(username: String)

object UserSearchForm {
  val form: Form[UserSearchFormData] = Form(
    mapping(
      "username" ->
        nonEmptyText.verifying(
          "Name must begin with a letter (a-z). Subsequent characters in a name can be letters, digits (0-9), or underscores.",
          name => name.matches("[a-z][a-z0-9_]*$")
        ),
    )(UserSearchFormData.apply)(UserSearchFormData.unapply)
  )
}
