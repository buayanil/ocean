package models

import play.api.libs.json.{Json, OWrites}


final case class User(id: Long = 0L, username: String, firstName: String, lastName: String, mail: String, employeeType: String)

object User {
  implicit val userWrites: OWrites[User] = Json.writes[User]
}