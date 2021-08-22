package models

import play.api.libs.json.{Json, OWrites}

sealed trait Response

case class ErrorResponse(errors: List[ErrorMessage]) extends Response

object ErrorResponse {
  implicit val errorBodyWrites: OWrites[ErrorResponse] = Json.writes[ErrorResponse]
}

case class ExistsInstanceResponse(exists: Boolean) extends Response

object ExistsInstanceResponse {
  implicit val existsInstanceResponseWrites: OWrites[ExistsInstanceResponse] = Json.writes[ExistsInstanceResponse]
}

case class LoginSuccessResponse(token: String) extends Response

object LoginSuccessResponse {
  implicit val loginSuccessResponseWrites: OWrites[LoginSuccessResponse] = Json.writes[LoginSuccessResponse]
}

case class InstanceDeletedResponse(rows: Int) extends Response

object InstanceDeletedResponse {
  implicit val instanceDeletedResponseWrites: OWrites[InstanceDeletedResponse] = Json.writes[InstanceDeletedResponse]
}

case class ExistsRoleResponse(exists: Boolean) extends Response

object ExistsRoleResponse {
  implicit val existsInstanceResponseWrites: OWrites[ExistsRoleResponse] = Json.writes[ExistsRoleResponse]
}
