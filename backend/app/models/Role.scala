package models

import play.api.libs.json.{Json, OWrites}

final case class Role(id: Long = 0, instanceId: Long, name: String, password: String)

object Role {
  implicit val InstanceWrites: OWrites[Role] = Json.writes[Role]
}

