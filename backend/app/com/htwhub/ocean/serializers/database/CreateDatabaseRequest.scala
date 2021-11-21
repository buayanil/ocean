package com.htwhub.ocean.serializers.database

import com.htwhub.ocean.models.Instance.EngineType
import play.api.data.Form
import play.api.data.Forms.mapping
import play.api.data.Forms.nonEmptyText
import play.api.libs.json.Json
import play.api.libs.json.OFormat

final case class CreateDatabaseRequest(name: String, engine: EngineType)

object CreateDatabaseRequest {
  implicit val createDatabaseRequestFormat: OFormat[CreateDatabaseRequest] = Json.format[CreateDatabaseRequest]
}

object CreateDatabaseSerializer {
  val constraints: Form[CreateDatabaseRequest] = Form(
    mapping(
      "name" -> nonEmptyText,
      "engine" -> nonEmptyText
    )(CreateDatabaseRequest.apply)(CreateDatabaseRequest.unapply)
  )
}
