package forms

import play.api.data.Form
import play.api.data.Forms.{longNumber, mapping, nonEmptyText}


case class CreateRoleFormData(instanceId: Long, name: String)

object CreateRoleForm {
  val form: Form[CreateRoleFormData] = Form(
    mapping(
      "instanceId" -> longNumber,
      "name" -> nonEmptyText,

    )(CreateRoleFormData.apply)(CreateRoleFormData.unapply)
  )
}
