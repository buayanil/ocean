package models

import java.sql.Timestamp
import play.api.libs.json.{Json, OWrites}
import play.api.data.Form
import play.api.data.Forms.mapping
import play.api.data.Forms._

final case class Instance(id: Long = 0, userId: Long, name: String, engine: String, createdAt: Timestamp)

object Instance {
  implicit val InstanceWrites: OWrites[Instance] = Json.writes[Instance]

  val ENGINE_TYPE_POSTGRESQL = "P"
  val ENGINE_TYPE_MONGODB = "M"
  val ENGINE_ALLOWED = List(ENGINE_TYPE_POSTGRESQL, ENGINE_TYPE_MONGODB)
}

case class CreateInstanceFormData(name: String, engine: String)

object CreateInstanceForm {

  val form: Form[CreateInstanceFormData] = Form(
    mapping(
      "name" -> nonEmptyText,
      "engine" ->
        nonEmptyText.verifying("Invalid engine type.", engine => Instance.ENGINE_ALLOWED.contains(engine)),
    )(CreateInstanceFormData.apply)(CreateInstanceFormData.unapply)
  )
}
