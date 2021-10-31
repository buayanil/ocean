package forms

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Forms.mapping

case class CreateInvitationFormData(instanceId: Long, userId: Long)

object CreateInvitationForm {
  val form: Form[CreateInvitationFormData] = Form(
    mapping(
      "instanceId" -> longNumber,
      "userId" -> longNumber,
    )(CreateInvitationFormData.apply)(CreateInvitationFormData.unapply)
  )
}
