package models

import play.api.libs.json.{Json, OWrites}


trait BaseUser {
  def username: String
  def firstName: String
  def lastName: String
  def mail: String
  def employeeType: String
}

final case class User(id: Long = 0L, username: String, firstName: String, lastName: String, mail: String, employeeType: String) extends BaseUser

final case class LdapUser(username: String, firstName: String, lastName: String, mail: String, employeeType: String) extends BaseUser

object User {
  implicit val userWrites: OWrites[User] = Json.writes[User]
}