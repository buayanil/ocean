package forms

import play.api.data.Form
import play.api.data.Forms.longNumber
import play.api.data.Forms.mapping
import play.api.data.Forms.nonEmptyText

case class CreateRoleFormData(instanceId: Long, roleName: String)

object CreateRoleForm {
  val form: Form[CreateRoleFormData] = Form(
    mapping(
      "instanceId" -> longNumber,
      "roleName" -> nonEmptyText
        .verifying(
          "Name must begin with a letter (a-z). Subsequent characters in a name can be letters, digits (0-9), or underscores.",
          name => name.matches("[a-z][a-z0-9_]*$")
        ),
    )(CreateRoleFormData.apply)(CreateRoleFormData.unapply)
  )
}

case class RoleExistsFormData(instanceId: Long, roleName: String)

object RoleExistsForm {
  val form: Form[RoleExistsFormData] = Form(
    mapping(
      "instanceId" -> longNumber,
      "roleName" -> nonEmptyText,
    )(RoleExistsFormData.apply)(RoleExistsFormData.unapply)
  )
}
