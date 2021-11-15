package com.htwhub.ocean.serializers.database

import com.htwhub.ocean.models.Instance.EngineType
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.libs.json.OFormat

final case class CreateDatabaseRequest(name: String, engine: EngineType)

object CreateDatabaseRequest {
  implicit val signInRequestFormat: OFormat[CreateDatabaseRequest] = Json.format[CreateDatabaseRequest]
}

object CreateDatabaseSerializer {
  val constraints: Form[CreateDatabaseRequest] = Form(
    mapping(
      "name" -> text,
      "engine" -> text
    )(CreateDatabaseRequest.apply)(CreateDatabaseRequest.unapply)
  )
}
