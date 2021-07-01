package models

import play.api.libs.json.{Json, OWrites}

sealed trait Response

case class ExistsInstanceResponse(exists: Boolean) extends Response

object ExistsInstanceResponse {
  implicit val existsInstanceResponseWrites: OWrites[ExistsInstanceResponse] = Json.writes[ExistsInstanceResponse]
}