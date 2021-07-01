package models

import java.sql.Timestamp
import play.api.libs.json.{Json, OWrites}

final case class Instance(id: Long = 0, userId: Long, name: String, engine: String, createdAt: Timestamp)

object Instance {
  implicit val InstanceWrites: OWrites[Instance] = Json.writes[Instance]

  val ENGINE_TYPE_POSTGRESQL = 'P'
  val ENGINE_TYPE_MONGODB = 'M'
}
