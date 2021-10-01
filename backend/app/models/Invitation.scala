package models

import java.sql.Timestamp
import play.api.libs.json.{Json, OWrites}

final case class Invitation(id: Long = 0, instanceId: Long, userId: Long, createdAt: Timestamp)

object Invitation {
  implicit val InvitationWrites: OWrites[Invitation] = Json.writes[Invitation]
}
