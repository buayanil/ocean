package com.htwhub.ocean.serializers

import play.api.libs.json.Json
import play.api.libs.json.OFormat

final case class SignInRequest(username: String, password: String)

object SignInRequest {
  implicit val signInRequestFormat: OFormat[SignInRequest] = Json.format[SignInRequest]
}
